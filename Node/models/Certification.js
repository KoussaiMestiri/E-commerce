const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      maxLength: 32
  },
  level:{
    type: String,
    enum: ["Beginner", "Intermediate", "Expert"],
    default: "Beginner",
  },
  certifiedFrom:{
      type: String,
      required: true,
      maxLength: 32
  }
});

module.exports = mongoose.model("Certification", certificationSchema);
