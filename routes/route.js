const express = require("express")
const {signup, login, logout, getAllUser, deleteUser, updateUser, getUser} = require("../controller/auth");
const {uploadImage, deleteImage, getImages}  = require("../controller/gallery");
const { createNotice, updateNotice, getNotice, getAllNotice, deleteNotice } = require("../controller/notice");
const { createProgram, updateProgram, getProgram, getAllProgram, deleteProgram } = require("../controller/awarenessProgram")
const upload = require("../util/multer");
const {isLoggedIn} = require("../middleware/auth");
const {isAdmin} = require("../middleware/auth");
const {isMember} = require("../middleware/auth");
const Router = express.Router();


Router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });
// authentication routes
Router.post("/api/auth/signup", isLoggedIn, isAdmin, signup);
Router.post("/api/auth/login", login);
Router.post("/api/auth/logout",isLoggedIn, logout);
Router.put("/api/auth/user/update/:userId", isLoggedIn, isAdmin, updateUser);
Router.get("/api/auth/getAllUser", isLoggedIn, isMember, getAllUser);
Router.get("/api/auth/getUser/:userId", isLoggedIn, isMember, getUser);
Router.delete("/api/auth/user/delete/:userId", isLoggedIn, isAdmin, deleteUser);


// gallery routes
Router.post("/api/image/upload", isLoggedIn, isAdmin, upload.single("image"), uploadImage)
Router.delete("/api/image/delete/:image_id", isLoggedIn, isAdmin, deleteImage);
Router.get("/api/image/getAllImages", getImages);


// notice routes
Router.post("/api/notice/create", isLoggedIn, isAdmin, createNotice);
Router.put("/api/notice/update/:noticeId", isLoggedIn, isAdmin, updateNotice);
Router.get("/api/notice/get/:noticeId", isLoggedIn, isAdmin, getNotice);
Router.get("/api/notice/getAll", isLoggedIn, isMember, getAllNotice);
Router.delete("/api/notice/delete/:noticeId", isLoggedIn, isAdmin, deleteNotice);

// program routes
Router.post("/api/program/create", isLoggedIn, isAdmin, createProgram);
Router.put("/api/program/update/:programId", isLoggedIn, isAdmin, updateProgram);
Router.get("/api/program/get/:programId", isLoggedIn, isAdmin, getProgram);
Router.get("/api/program/getAll", getAllProgram);
Router.delete("/api/program/delete/:programId", isLoggedIn, isAdmin, deleteProgram);

module.exports = Router;