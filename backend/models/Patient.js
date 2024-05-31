const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    bloodPressure: {
      type: String,
      required: true,
    },
    temperature: {
      type: String,
      required: true,
    },
    pulse: {
      type: String,
      required: true,
    },
    assignedDoctor: {
      type: String,
    },
    status: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);
