const mongoose = require("mongoose");

const noticeSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: [true, "Title must be specified"],
        trim: true,
        maxLength: [60, "Title length should not exceed 60 characters"]
    },
    message: {
        type: String,
        required: [true, "Please, specify the notice body"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Notice", noticeSchema);