const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for Room Types, which could be referenced in the main room schema
const roomTypeSchema = new Schema({
    typeName: { type: String, required: true }
});

// Define a schema for Room
const roomSchema = new Schema({
    roomType: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomType', required: true },
    roomNumber: { type: Number, required: true },
    filledStatus: String
});

// Define a schema for Event, which might be needed to associate room requirements
const processSchema = new Schema({
    processName: { type: String, required: true },
});

// Availability Schema to manage booking times and dates
const availabilitySchema = new Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // Time as string e.g., '14:00'
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
});

// Booking Schema that binds an event, room, doctor, and patient
const bookingSchema = new Schema({
    // process: { type: mongoose.Schema.Types.ObjectId, ref: 'Process', required: true },
    // room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    // doctorId: { type: String, ref: 'User', required: true }, // Could link to a User schema if exists
    // patientId: { type: String, ref: 'Patient', required: true }, // Could link to a Patient schema if exists
    // date: { type: Date, required: true },
    // startTime: { type: String, required: true },
    // endTime: { type: String, required: true },
    // tag: { type: String }

    process: { type: Schema.Types.ObjectId, ref: 'Process', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Linking to a User schema
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true }, // Linking to a Patient schema
    date: { type: Date, required: true },
    startTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }, // Ensures time is in HH:MM format
    endTime: { type: String, required: true, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }, // Ensures time is in HH:MM format
    tag: { type: String, default: '' } // Optional field with default value
});

// Export schemas
const RoomType = mongoose.model('RoomType', roomTypeSchema);
const Room = mongoose.model('Room', roomSchema);
const Process = mongoose.model('Process', processSchema);
const Availability = mongoose.model('Availability', availabilitySchema);
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = { RoomType, Room, Process, Availability, Booking };
