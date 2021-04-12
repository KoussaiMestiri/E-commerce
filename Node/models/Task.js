const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    maxLength: 120,
  },
  status: {
    type: String,
    enum: ["success", "pending", "failed"],
    default: "pending",
  },

});




module.exports = mongoose.model('Task', taskSchema)
