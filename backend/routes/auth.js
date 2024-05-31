const router = require("express").Router();
const User = require("../models/User");
const Resource = require("../models/Resource");
const { login, verifyToken } = require("../controllers/auth");
const { checkAuth } = require("../middlewares/checkAuth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/newAccount", async (req, res) => {
  const { email, name, role, department, address, gender, password, phonenum } =
    req.body.data;
  try {
    /**Generate 9 digit ID and ensure the generated ID is not used in database*/
    const min = 100000000;
    const max = 999999999;
    const newID = Math.floor(Math.random() * (max - min + 1)) + min;
    const existingID = await User.findOne({ id: newID });
    while (existingID) {
      newID = Math.floor(Math.random() * (max - min + 1)) + min;
      existingID = await User.findOne({ id: newID });
    }

    /**Ensure no repetitive Email */
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(200)
        .json({ success: false, error: "User already existed" });
    }
    let user = new User({
      id: newID,
      email: email,
      name: name,
      role: role,
      department: department,
      address: address,
      gender: gender,
      password: bcrypt.hashSync(password, 10),
      phonenum: phonenum,
      task: new Array(5),
    });

    const { password: hashedPassword, ...userWithoutPassword } =
      user.toObject();
    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET_KEY);

    user.save();
    res.status(200).json({ success: true, user: userWithoutPassword, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/allAccount", async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/deleteAccount", async (req, res) => {
  const email = req.body.email;
  try {
    const deletedUser = await User.findOneAndDelete({ email: email });
    if (!deletedUser) {
      // If no user was found and deleted, return a 404 not found response
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ scuuess: false, error: error });
  }
});

router.post("/passwordRecovery", async (req, res) => {
  const { email, newPW } = req.body.data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Password recovery failed. No such user",
      });
    }

    user.password = bcrypt.hashSync(newPW, 10);

    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/forgetPassword", async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res
      .status(200)
      .json({ success: false, error: "Please provide email" });
  }

  if (!email.includes("@") || !email.includes(".")) {
    return res
      .status(200)
      .json({ success: false, error: "Please enter a valid email address" });
  }

  const temp_password = generatedRandomPassword();

  try {
    const existingUser = await User.findOneAndUpdate(
      { email: email },
      { tempPassword: temp_password },
      { new: true }
    );
    res.status(200).json({
      success: true,
      name: existingUser.name,
      to_email: existingUser.email,
      temp_password: existingUser.tempPassword,
    });
  } catch (error) {
    res.status(200).json({ scuuess: false, error: "*User does not exist" });
  }
});

function generatedRandomPassword() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const passwordLength = 8;
  let password = "";

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

// POST /auth/login
router.post("/login", login);

// GET /auth/verify-token
router.get("/verify-token", checkAuth, verifyToken);

module.exports = router;
