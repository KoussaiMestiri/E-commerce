const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      maxLength: 32
  },
  level:{
    type: String,
    enum: ["Beginner", "Intermediate", "Expert"],
    default: "Beginner",
  }
});

module.exports = mongoose.model("Skill", skillSchema);
