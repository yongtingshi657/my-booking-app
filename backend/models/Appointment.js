const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
  clientId: {
    type: mongoose.Types.ObjectId,
    ref: "Client",
    required: [true, "Please provide Client Id"],
  },
  clientName: {
    type: String,
    required: [true, "Please provide Client name"],
  },
  start: {
    type: Date,
    required: [true, "Please provide Start Time"],
  },
  end: {
    type: Date,
    required: [true, "Please provide End Time"],
  },
  status: {
     type: String,
     enum:['scheduled','canceled', 'completed' ],
     default:'scheduled'
  }
}, { timestamps: true });


module.exports = mongoose.model('Appointment', AppointmentSchema)