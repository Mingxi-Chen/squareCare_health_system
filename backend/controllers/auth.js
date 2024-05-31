const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Please provide username and password",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const { password: hashedPassword, ...userWithoutPassword } =
      user.toObject();

    console.log(process.env.JWT_SECRET_KEY);
    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET_KEY);

    res.json({ success: true, user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "An error occurred during login. Please try again.",
    });
  }
};

const verifyToken = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ success: false, error: "Invalid or missing token" });
  } else {
    res.status(200).json({ success: true, user: req.user });
  }
};

module.exports = {
  login,
  verifyToken,
};
