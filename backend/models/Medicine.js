const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    duration: { type: String, required: true },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Medication', medicationSchema);