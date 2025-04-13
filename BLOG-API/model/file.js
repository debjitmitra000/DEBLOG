const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
  format: { type: String },
  size: Number,
  mimetype: String,
  createdBy: { type: mongoose.Types.ObjectId, ref: "user", required: true }
}, { timestamps: true });

const File = mongoose.model("file", fileSchema);

module.exports = File;