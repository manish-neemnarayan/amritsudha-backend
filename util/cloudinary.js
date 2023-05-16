const config = require("../config/index");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET,
}); 
module.exports = cloudinary;