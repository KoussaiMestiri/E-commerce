const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      maxLength: 32
  },
  level:{
    type: String,
    required: true
  },
  country:{
      type: String,
      required: true
  },
  yearOfGraduation:{
      type: Date,
      required: true
  }
});

module.exports = mongoose.model("Education", educationSchema);
