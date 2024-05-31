const router = require("express").Router();
const User = require("../models/User");
const Event = require("../models/Event");

const getAllDocs = async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" }, "-password");
    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

const addEvent = async (req, res) => {
  //console.log("Successfully getAllEvents")
  const { userid, title, start, end, allDay } = req.body;
  //console.log(req.body);

  let newEvent = new Event({
    userid: userid,
    title: title,
    start: start,
    end: end,
    allday: allDay,
  });
  //console.log(newEvent);
  await newEvent.save();

  const user = await User.findOneAndUpdate(
    { id: userid },
    { $push: { Event: newEvent._id } }
  );

  //console.log(user)

  res.status(200).json({ message: "Successfully getAllEvents" });
};

module.exports = {
  getAllDocs,
  addEvent,
};
