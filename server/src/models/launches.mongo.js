const { Schema, model } = require('mongoose');

const launchesSchema = new Schema({
    flightNumber: { type: Number, required: true },
    mission: { type: String, required: true },
    rocket: { type: String, required: true },
    target: { type: String},
    launchDate: { type: Date, required: true },
    upcoming: { type: Boolean, required: true },
    success: { type: Boolean, required: true, default: true },
    customers: [String]
});

module.exports = model('Launch', launchesSchema);