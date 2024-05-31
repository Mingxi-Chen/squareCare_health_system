const router = require("express").Router();
// Ensure correct model is required
const { RoomType, Room, Process, Availability, Booking } = require('../models/Room');
const Resource = require("../models/Resource");

router.post("/addRoom", async (req, res) => {
    console.log("Received body: ", req.body);
    const { roomType, roomNumber, filledStatus } = req.body;

    // Check for required fields
    if (!roomType || !roomNumber || !filledStatus) {
        return res.status(400).json({
            success: false,
            message: 'Room type, room number, and filled status are required'
        });
    }

    try {
        // Check if roomType exists, if not create a new one
        const roomTypeObj = await RoomType.findOneAndUpdate(
            { typeName: { $regex: new RegExp(`^${roomType}$`, 'i') } },
            { $setOnInsert: { typeName: roomType } },
            { new: true, upsert: true } // This option creates the document if it doesn't exist
        );

        // Create a new room with the roomTypeObj _id and filledStatus
        const newRoom = new Room({
            roomType: roomTypeObj._id, // Set the ObjectId reference to RoomType
            roomNumber: roomNumber,
            filledStatus: filledStatus
        });

        await newRoom.save();
        res.status(200).json({ success: true, data: newRoom });
    } catch (error) {
        console.error("Failed to add new room:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// Fetching all rooms
router.get("/allRoom", async (req, res) => {
    console.log("Fetching all rooms...");

    try {
      const rooms = await Room.find({}).populate({
        path: 'roomType',
        select: 'typeName' // Only select typeName from RoomType
      });
      console.log(rooms);
    //   const data = rooms.map(room => ({
    //     roomType: room.roomTypes.typeName,
    //     roomNumber: room.roomNumber,
    //     filledStatus: room.filledStatus,
    //     _id : room.id
    //   }));    
      const data = rooms.map(room => ({
        roomType: room.roomType.typeName,
        roomNumber: room.roomNumber,
        filledStatus: room.filledStatus,
        _id: room.id
    }));
   

      console.log("Room types and rooms fetched:", data);
      res.status(200).json(data);
      
    } catch (error) {
        console.log("Failed to fetch room types and rooms:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Deleting rooms
router.post('/deleteRooms', async (req, res) => {
    const { ids } = req.body;
    console.log("Deleting rooms with IDs:", ids);
    try {
        const result = await Room.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ success: true, message: 'Rooms deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting rooms', error: error.message });
    }
});

// Updating a room
router.put('/updateRoom/:id', async (req, res) => {
    const { id } = req.params;
    const { roomType, roomNumber } = req.body;

    if (!roomType || !roomNumber) {
        return res.status(400).json({ success: false, message: 'Room type and room number are required' });
    }

    try {
        
        // Check if the roomType exists in the database, using a case-insensitive search
        let roomTypeObj = await RoomType.findOne({ typeName: { $regex: new RegExp(`^${roomType}$`, 'i') } });

        if (!roomTypeObj) {
            // If roomType does not exist, return an informative error message
            return res.status(404).json({
                success: false, 
                message: 'Room Type does not exist. Please click the "Add Room" button to create a new room type.'
            });
        }

        // Find the existing room by id and update it
        const room = await Room.findById(id);
        if (!room) {
            // If no existing room is found, create a new room
            const newRoom = new Room({
                roomType: roomTypeObj._id,
                roomNumber
            });
            await newRoom.save();
            return res.status(201).json({ success: true, data: newRoom });
        } else {
            // If the room exists, update it
            room.roomType = roomTypeObj._id;
            room.roomNumber = roomNumber;
            await room.save();
            return res.status(200).json({ success: true, data: room });
        }
    } catch (error) {
        console.error('Error in updating/creating room:', error);
        res.status(500).json({ success: false, message: 'Failed to update or create room', error: error.message });
    }
});

module.exports = router;
