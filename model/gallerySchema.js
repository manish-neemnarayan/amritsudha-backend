const mongoose = require("mongoose");

const gallerySchema = mongoose.Schema({
    title: {
        type: String,
        maxLength: [40, "Title name should not exceed 40 characters"]
    },

    description: {
        type: String,
        maxLength: [100, "Description should be under 100 characters"]
    },

    avatar: {
        type: String
    },

    cloudinary_id: {
        type: String
    }
});

module.exports = mongoose.model("Gallery", gallerySchema);
