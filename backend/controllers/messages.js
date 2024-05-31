const path = require("node:path");
const Message = require("../models/Message");
const User = require("../models/User");

const getAvailableChats = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await User.find(
      { role: { $in: ["Doctor", "Nurse", "Hospital Admin", "Technician"] } },
      "-password"
    );
    const messageUsers = await Message.find({ users: id }).select("users");
    const uniqueMessageUsers = messageUsers
      .map((chat) => chat.users.map((e) => e.toString()))
      .flat();

    const availableUsers = users.filter(
      (u) =>
        uniqueMessageUsers.indexOf(u._id.toString()) === -1 &&
        u._id.toString() !== id
    );

    res.json({ success: true, users: availableUsers });
  } catch (error) {
    console.error(error);
  }
};

const createGroup = async (req, res) => {
  const { users } = req.body;
  if (!users) {
    return res.json({ success: false, error: "Invalid users" });
  }

  try {
    const group = await new Message({
      users,
      conversation: [],
    }).populate("users conversation.author", "-password");
    await group.save();
    res.json({ success: true, group });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
};

const getGroups = async (req, res) => {
  const { id } = req.params;
  try {
    const groups = await Message.find({ users: id }).populate(
      "users conversation.author",
      "-password"
    );
    res.json({ success: true, groups });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

const updateConversation = async (req, res) => {
  const { id } = req.params;
  try {
    let group = await Message.findOne({ _id: id });
    const newConversation = {
      text: req.body.text,
      createdAt: req.body.createdAt,
      author: req.body.author,
    };

    if (req.file) {
      newConversation.file = {
        originalFilename: req.file.originalname,
        filename: req.file.filename,
      };
    }

    group.conversation.push(newConversation);

    await group.save();
    await group.populate("users conversation.author", "-password");
    res.json({
      success: true,
      group,
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

const downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", filename);

  res.download(filePath);
};

module.exports = {
  createGroup,
  getAvailableChats,
  getGroups,
  updateConversation,
  downloadFile,
};
