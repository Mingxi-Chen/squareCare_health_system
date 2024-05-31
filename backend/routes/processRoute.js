const router = require("express").Router();
// Ensure correct model is required
const { RoomType, Room, Process, Availability, Booking } = require('../models/Room');
const User = require('../models/User');
const Patient = require('../models/Patient');
const mongoose = require('mongoose');
const Event = require('../models/Event'); 
const {sendNotificationToUser} = require('../server');
const Notification = require("../models/Notification")

router.post("/searchRooms", async (req, res) => {
    const { date, roomType } = req.body;
    console.log("backend server: ", date, roomType)
    // Convert scheduleDate to a consistent format or use Date objects for comparison
    try {
        // First, find the RoomType based on the typeName provided
        const type = await RoomType.findOne({ typeName: roomType });
        if (!type) {
            return res.status(404).json({ message: "Room type not found" });
        }

        // If the RoomType exists, find all rooms of that type that are not booked
        const rooms = await Room.find({ roomType: type._id });

        console.log("rooms from typeid",rooms )
         // Calculate the start and end of the day
         const startOfDay = new Date(date);
         startOfDay.setUTCHours(0, 0, 0, 0);
         
         // Setting the end of the day
         const endOfDay = new Date(date);
         endOfDay.setUTCHours(23, 59, 59, 999);

        // Now find availability of these rooms on the specified date
        const notAvailableRooms = await Availability.find({
            room: { $in: rooms.map(room => room._id) },
            // date: new Date(date), // Ensure that date formats match
            date: new Date(date),
            // date: { $gt: startOfDay, $lt: endOfDay },
            isBooked: true
        }).populate('room', 'roomNumber'); // Populate to get room number
        console.log("not available",notAvailableRooms);



    
        // const availabilityDate = new Date('2024-5-04');  // An example date
        // const startTime = '13:00';
        // const endTime = '15:00';
        // const isBooked = true;
        // const newAvailability = new Availability({
        //     room: '66306d1ef7b4db1a052788be',
        //     date: availabilityDate,
        //     startTime: startTime,
        //     endTime: endTime,
        //     isBooked: isBooked
        // });
        // newAvailability.save()
        res.json({
            rooms: rooms,
            notAvailableRooms: notAvailableRooms
        });
    } catch (error) {
        console.error("Failed to search for available rooms: ", error);
        res.status(500).json({ message: "Server error while searching for rooms" });
    }
    // res.json(availableRooms);
})

router.post("/searchStaffs", async (req, res) => {
    try {
        // Fetch users where the role is either 'Doctor' or 'Technician'
        const staffs = await User.find({ 
            // role: { $in: ['Doctor', 'Technician'] }
            role: { $in: ['Doctor'] }
        });
        // console.log("searchStaff from backend", staffs)
        // Check if any staff members were found
        if (!staffs || staffs.length === 0) {
            return res.status(404).json({ message: "No staff members found." });
        }

        // Respond with the list of staff members
        res.json(staffs);
    } catch (error) {
        console.error("Failed to search for staff: ", error);
        res.status(500).json({ message: "Server error while searching for staff members" });
    }
});

router.post("/submitProcedure", async (req, res) => {
    const { date, roomType, processName, selectedRoom, selectedDoctor, startTime, endTime, tag, patientId } = req.body;
    console.log(selectedRoom)
    // const roomFindTest = await Room.find({ _id: selectedRoom });
    // console.log("find selected room in db", roomFindTest)
    // console.log(new Date(date))
    console.log(tag)
    try {
        const room = await Room.findById(selectedRoom);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Parse the current filledStatus
        let [current, total] = room.filledStatus.split('/').map(Number);
        if (current >= total) {
            return res.status(400).json({ message: "Room is currently full and cannot be booked" });
        }


        // This block is used to check time conflicts
        // Convert user provided date to start and end of that day in UTC
        const dateStart = new Date(date);
        dateStart.setUTCHours(0,0,0,0);
        const dateEnd = new Date(date);
        dateEnd.setUTCHours(23,59,59,999);

        /* 
        // This block is used to check time conflicts - - - - - - - - - -
        Finding conflicts by checking overlap within the same day
        */
        const conflicts = await Availability.find({
            room: selectedRoom,
            date: { $gte: dateStart, $lte: dateEnd },
            $or: [
                { startTime: { $lte: endTime }, endTime: { $gte: startTime } }
            ]
        });
        console.log("conflicts times", conflicts)
        if (conflicts.length > 0) {
            return res.status(400).json({ message: "Time conflict with an existing booking" });
        }

        /* 
        This block is used to create new Availability
        */
        // Step 2: Create and Save the Availability
        const newAvailability = new Availability({
            room: selectedRoom,
            date: new Date(date),
            startTime: startTime,
            endTime: endTime,
            isBooked: true  // Since this is a booking, we mark it as booked
        });

        await newAvailability.save();

        /* 
        This block is used to create new Booking
        */
        // Step 3: Create and Save the Booking
        const newProcess = new Process({ processName });
        await newProcess.save();

        // Step 2: Create and Save the Booking
        const newBooking = new Booking({
            process: newProcess._id,  // Reference the newly created Process
            room: selectedRoom,
            doctorId: selectedDoctor,
            patientId: patientId,  // Adjust based on your application needs
            date: new Date(date),
            startTime: startTime,
            endTime: endTime,
            // tagType: tag
            tag
        });

        //Yunjia for notification 
        sendNotificationToUser(selectedDoctor, "A new procedure has been scheduled.");
        const patient = await Patient.findById(patientId);
        let content = `A new procedure has been scheduled with patient ${patient.firstName} ${patient.lastName} from ${startTime} tp ${endTime} on ${date}`
        const notification = new Notification({
            sentTo : selectedDoctor,
            time :  Date.now(),
            content : content
        })
        await notification.save();
        await newBooking.save();


         // Update the room's filledStatus
         current += 1; // Increment the count of occupied slots
         const updatedFilledStatus = `${current}/${total}`;
         await Room.findByIdAndUpdate(selectedRoom, { filledStatus: updatedFilledStatus });
 
         // Respond with success
         res.status(201).json({ message: "Procedure submitted successfully", availability: newAvailability, booking: newBooking, roomStatus: updatedFilledStatus });
        // res.status(201).json({ message: "Procedure submitted successfully", availability: newAvailability, roomStatus: updatedFilledStatus });
        } catch (error) {
         console.error("Error submitting procedure: ", error);
         res.status(500).json({ message: "Server error while submitting procedure" });
     }
});

router.get('/getAllBookings', async (req, res) => {
    const { patientId } = req.query;
    console.log(patientId)
    console.log("Fetching all bookings...");

    try {
        // Perform the query using the ObjectId and directly querying the 'patientId' field
        const bookings = await Booking.find({  })
        .populate({
            path:'process',
            select: 'processName' 
        })
        .populate({
            path: 'room',
            select: 'roomNumber',
            populate:{
                path:'roomType',
                select: 'typeName'
            }
        })
        .populate({
            path: 'doctorId',
            select: 'name'
        })
        .populate({
            path: 'patientId',
            select: ['firstName','lastName']
        })


        // console.log(bookings);
        // console.log(bookings.map(booking => ({
        //     processName: booking.process ? booking.process.processName : 'No process name', // Check for undefined
        //     roomNumber: booking.room ? booking.room.roomNumber : 'No room number',
        //     roomType: booking.room && booking.room.roomType ? booking.room.roomType : 'No room type',
        //     doctorName: booking.doctorId ? booking.doctorId.name : 'No doctor name',
        //     patientName: booking.patientId ? booking.patientId.name : 'No patient name',
        //     date: booking.date,
        //     startTime: booking.startTime,
        //     endTime: booking.endTime
        // })));


        // console.log(bookings);
        console.log(bookings.length);
        res.json(bookings);
      } catch (error) {
        console.error("Failed to retrieve bookings: ", error);
        res.status(500).json({ error: error.message });
      }
});

router.delete('/deleteBooking/:bookingId', async (req, res) =>{
    const {bookingId} = req.params;
    console.log("From backend bookingId1",bookingId)
    try{
        // console.log("From backend bookingId",bookingId)
        // // find the room number and reduce 1 fillstatus
        // const roomNumber = await Booking.findById(bookingId);
        // console.log(roomNumber.room)
        // // delete booking
        // const deletedBooking = await Booking.findByIdAndDelete(bookingId);
        // res.send(`Booking with ID ${bookingId} deleted successfully.`);


        // Find the booking by its ID
                // Find the booking by its ID
                const booking = await Booking.findById(bookingId);
                if (!booking) {
                    return res.status(404).send(`Booking with ID ${bookingId} not found.`);
                }
                // Extract room ID from the booking
                const roomId = booking.room;
                // Find the associated room and update its filled status
                const room = await Room.findById(roomId);
                if (room) {
                    // Split filledStatus (e.g., "3/5") to separate current from total
                    let [current, total] = room.filledStatus.split('/').map(Number);
                    
                    // Decrement the current count if it's not already zero
                    if (current > 0) {
                        current -= 1;
                        room.filledStatus = `${current}/${total}`;
                        await room.save();
                    }
                } else {
                    return res.status(404).send(`Room with ID ${roomId} not found.`);
                }
        
                // Delete the booking from the database
                await Booking.findByIdAndDelete(bookingId);
                // Respond with success
                res.send(`Booking with ID ${bookingId} deleted successfully.`);
    }catch(error){
        console.error('Error deleting booking:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/getRoomTypes', async (req, res) => {
    try {
      const roomTypes = await RoomType.find({});
      res.json(roomTypes);
    } catch (error) {
      console.error("Failed to retrieve room types: ", error);
      res.status(500).json({ message: "Server error while retrieving room types" });
    }
  });

// Route to create an event based on submitted data
router.post('/createEvent', async (req, res) => {
    const { selectedDoctor, startTime, endTime, processName,date } = req.body;

    try {
        // Find the user by ID (assuming selectedDoctor is a userId)
        const doctor = await User.findById(selectedDoctor);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        console.log("from backend doctor",doctor,"  id:  ",doctor.id)
        console.log(doctor.id,  processName, new Date(`${date}T${startTime}`),  new Date(`${date}T${endTime}`), )
        // Create a new Event instance
        const newEvent = new Event({
            userid: doctor.id,
            title: processName,
            start: new Date(`${date}T${startTime}`),
            end: new Date(`${date}T${endTime}`),
            allDay: false,
            // otherFaculties: doctor._id  // Adjust as necessary based on your logic
        });

        // Save the event to the database
        await newEvent.save();

        // push into doctor event array
        doctor.Event.push(newEvent.id)
        await doctor.save();

        // console.log(Event.findOne({userid: doctor.id}))
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        console.error('Failed to create event:', error);
        res.status(500).json({ message: 'Server error while creating event' });
    }
});

module.exports = router;
