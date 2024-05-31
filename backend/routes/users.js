const router = require("express").Router();
const {
  getAllDocs,
  addEvent,
  getAllEvents,
} = require("../controllers/users");
const User = require("../models/User");
const Event = require("../models/Event");
const Roster = require("../models/Roster");

router.get("/doctors", getAllDocs);
//router.get("/", getAll);
router.post("/addevents", addEvent);

router.get("/allevents/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ id: id }).populate();
    const eventIds = user.Event.map((event) => event._id);

    let eventList = [];
    for (let i = 0; i < eventIds.length; i++) {
      eventList.push(await Event.findById(eventIds[i]));
    }
    res.status(200).json({ data: eventList });
  } catch (error) {
    res.status(404).json({ success: false, error: "No such user" });
  }
});

router.delete("/deleteEvent", async (req, res) => {
  try {
    const { id, user_id } = req.body;
    await User.findOneAndUpdate(
      { id: user_id },
      { $pull: { Event: id } },
      { new: true }
    );
    await Event.findByIdAndDelete(id);
    res.status(200).json();
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/moveEvent", async (req, res) => {
  try {
    const { eventid, start, end, allDay } = req.body;
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventid },
      { start: start, end: end, allday: allDay },
      {}
    );
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

router.post("/addRoster", async (req, res) => {
  const { userid, daysOfWeek, startTime, endTime, allDay } = req.body;
  let newRoster = new Roster({
    userid: userid,
    daysOfWeek: [daysOfWeek],
    startTime: startTime,
    endTime: endTime,
    allday: allDay,
  });
  await newRoster.save();

  const user = await User.findOneAndUpdate(
    { id: userid },
    { $push: { Roster: newRoster._id } }
  );

  res.status(200).json({ message: "Successfully getAllEvents" });
});

router.get("/allRosters/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ id: id }).populate();
    const rosterIds = user.Roster.map((roster) => roster._id);
    let rosterList = [];
    for (let i = 0; i < rosterIds.length; i++) {
      rosterList.push(await Roster.findById(rosterIds[i]));
    }
    res.status(200).json({ data: rosterList });
  } catch (error) {
    res.status(404).json({ success: false, error: "No such user" });
  }
});

router.delete("/deleteRoster", async (req, res) => {
  try {
    const { id, user_id } = req.body;
    await User.findOneAndUpdate(
      { id: user_id },
      { $pull: { Roster: id } },
      { new: true }
    );
    await Roster.findByIdAndDelete(id);
    res.status(200).json();
  } catch (error) {
    res.status(404).json(error);
  }
});

router.post("/moveRoster", async (req, res) => {
  try {
    const { eventid, startTime, endTime, allDay, daysOfWeek } = req.body;
    const updatedEvent = await Roster.findOneAndUpdate(
      { _id: eventid },
      {
        startTime: startTime,
        endTime: endTime,
        allday: allDay,
        daysOfWeek: daysOfWeek,
      },
      {}
    );
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

router.get("/allTasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ id: id }).populate();
    res.status(200).json(user.task);
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, error: "No such user" });
  }
});

router.post("/taskChange", async (req, res) => {
  try {
    const { index, value, userid } = req.body;
    console.log(req.body);
    const user = await User.findOne({ id: userid }).populate();
    user.task[index] = value;
    user.save();
    res.status(200).json();
  } catch (error) {
    res.status(404).json(error);
  }
});

router.get("/allInfo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ id: id }).populate();
    const data = {
      name: user.name,
      email: user.email,
      gender: user.gender,
      address: user.address,
      phone: user.phonenum,
      id: user.id,
      department: user.department,
    };
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(404).json({ error: "Can not find such user" });
  }
});

router.post("/changeInfo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.body);
    const { name, gender, department, address } = req.body;
    const user = await User.findOneAndUpdate(
      { id: id },
      { name: name, gender: gender, department: department, address: address }
    );
    res.status(200).json();
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

module.exports = router;
