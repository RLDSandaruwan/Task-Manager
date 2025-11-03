const mongoose = require("mongoose");

const labelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a label name"],
      unique: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#888888", 
    },
  },
  {
    timestamps: true,
  }
);

const Label = mongoose.model("Label", labelSchema);
module.exports = Label;
