const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
    id: { type: String, required: true },
    size: Number,
    mimetype: String,
    createdBy: { type: mongoose.Types.ObjectId, ref: "user", required: true }
}, { timestamps: true });

const File = mongoose.model("file", fileSchema);

module.exports = File;
