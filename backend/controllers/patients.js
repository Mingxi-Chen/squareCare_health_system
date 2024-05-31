const Patient = require("../models/Patient");
const User = ["Doctor", "Hospital Admin", "Nurse", "Technician"];

// Create a new patient
const createPatient = async (req, res) => {
/*   if (!User.includes(req.user?.role)) {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  } */

  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    bloodGroup,
    bloodPressure,
    temperature,
    pulse,
    assignedDoctor,
    status,
    email,
    phone,
    address,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !gender ||
    !bloodGroup ||
    !bloodPressure ||
    !temperature ||
    !pulse ||
    !assignedDoctor ||
    !status ||
    !email ||
    !phone ||
    !address
  ) {
    res
      .status(400)
      .json({ success: false, error: "Please provide all fields" });
    return;
  }

  try {
    const patient = await Patient.create({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bloodGroup,
      bloodPressure,
      temperature,
      pulse,
      assignedDoctor,
      status,
      email,
      phone,
      address,
    });
    res.json({ success: true, patient: patient,patientid:patient._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all valid patients
const getAll = async (req, res) => {
/*   if (!User.includes(req.user?.role)) {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  } */
  try {
    const patients = await Patient.find({});
    res.json({ success: true, patients });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

// Get a specific patient
const getPatient = async (req, res) => {
  // if (!User.includes(req.user?.role)) {
  //   return res.status(403).json({ success: false, error: "Unauthorized" });
  // }
  try {
    console.log(`${req.params.id}`)
    const patient = await Patient.findOne({ _id: req.params.id });
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, error: "Cannot find Patient ID" });
    }
    res.json({ success: true, patient });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

// Delete a specific patient
const deletePatient = async (req, res) => {
/*   if (!User.includes(req.user?.role)) {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  } */
  try {
    await Patient.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

const editPatient = async (req, res) => {
/*   if (!User.includes(req.user?.role)) {
    return res.status(403).json({ success: false, error: "Unauthorized" });
  } */
  try {
    const patient = await Patient.findOne({ _id: req.params.id });
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, error: "Invalid Patient ID" });
    }
    patient.firstName = req.body.firstName;
    patient.lastName = req.body.lastName;
    patient.dateOfBirth = req.body.dateOfBirth;
    patient.gender = req.body.gender;
    patient.bloodGroup = req.body.bloodGroup;
    patient.bloodPressure = req.body.bloodPressure;
    patient.temperature = req.body.temperature;
    patient.pulse = req.body.pulse;
    patient.assignedDoctor = req.body.assignedDoctor;
    patient.status = req.body.status;
    patient.email = req.body.email;
    patient.phone = req.body.phone;
    patient.address = req.body.address;
    await patient.save();
    res.json({ success: true, patient });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

module.exports = {
  createPatient,
  getAll,
  getPatient,
  deletePatient,
  editPatient,
};
