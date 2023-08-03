const express = require("express");
const {
  signup,
  login,
  logout,
  getAllUser,
  deleteUser,
  updateUser,
  getUser,
} = require("../controller/auth");
const {
  uploadImage,
  deleteImage,
  getImages,
} = require("../controller/gallery");
const {
  createNotice,
  updateNotice,
  getNotice,
  getAllNotice,
  deleteNotice,
} = require("../controller/notice");
const {
  createProgram,
  updateProgram,
  getProgram,
  getAllProgram,
  deleteProgram,
} = require("../controller/awarenessProgram");
const upload = require("../util/multer");
const { isLoggedIn } = require("../middleware/auth");
const { isAdmin } = require("../middleware/auth");
const { isMember } = require("../middleware/auth");
const Router = express.Router();

Router.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});
// authentication routes

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     description: for creating a new user
 *     responses:
 *       200:
 *         description: created user
 */
Router.post("/api/auth/signup", isLoggedIn, isAdmin, signup);

/**
  @swagger
  /api/auth/login:
    post:
      description: Login a user and return user object
       requestBody: 
         required: true
     operationId: loginUser
      parameters:
        - name: username
          in: query
          description: The user name for login
          required: true
          schema:
            type: string
        - name: password
          in: query
          description: The password for login in clear text
          required: true
          schema:
            type: string
      responses:
        '200':
          description: successful operation
          headers:
            X-Rate-Limit:
              description: calls per hour allowed by the user
              schema:
                type: integer
                format: int32
            X-Expires-After:
              description: date in UTC when token expires
              schema:
                type: string
                format: date-time
          content:
            application/xml:
              schema:
                type: string
            application/json:
              schema:
                type: string
        '400':
          description: Invalid username/password supplied */
Router.post("/api/auth/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     description: to logout user
 *     responses:
 *       200:
 *         description: clearing cookies
 */
Router.post("/api/auth/logout", isLoggedIn, logout);

/**
 * @swagger
 * /api/auth/user/update/:userId:
 *   put:
 *     description: Update the user into the database
 *     responses:
 *       200:
 *         description: return updated user
 */
Router.put("/api/auth/user/update/:userId", isLoggedIn, isAdmin, updateUser);

/**
 * @swagger
 * /api/auth/getAllUser:
 *   get:
 *     description: Retrieve all signed up user
 *     responses:
 *       200:
 *         description: return users
 */
Router.get("/api/auth/getAllUser", isLoggedIn, isMember, getAllUser);

/**
 * @swagger
 * /api/auth/getUser/:userId:
 *   get:
 *     description: Retrieve login user
 *     responses:
 *       200:
 *         description: return loggedin user
 */
Router.get("/api/auth/getUser/:userId", isLoggedIn, isMember, getUser);

/**
 * @swagger
 * /api/auth/getUser/:userId:
 *   delete:
 *     description: delete user by specified id
 *     responses:
 *       200:
 *         description: User is removed successfully
 */
Router.delete("/api/auth/user/delete/:userId", isLoggedIn, isAdmin, deleteUser);

// gallery routes

/**
 * @swagger
 * /api/image/upload:
 *   post:
 *     description: upload the image using cloudinary
 *     responses:
 *       200:
 *         description: upload the image
 */
Router.post(
  "/api/image/upload",
  isLoggedIn,
  isAdmin,
  upload.single("image"),
  uploadImage
);

/**
 * @swagger
 * /api/image/delete/:image_id:
 *   delete:
 *     description: delete the image from db and cloudinary
 *     responses:
 *       200:
 *         description: upload the image
 */
Router.delete("/api/image/delete/:image_id", isLoggedIn, isAdmin, deleteImage);

/**
 * @swagger
 * /api/image/getAllImages:
 *   get:
 *     description: Getting all the images
 *     responses:
 *       200:
 *         description: Getting all the images
 */
Router.get("/api/image/getAllImages", getImages);

// notice routes

/**
 * @swagger
 * /api/notice/create:
 *   post:
 *     description:create a new notice and return created notice
 *     responses:
 *       200:
 *         description: user should be admin
 */
Router.post("/api/notice/create", isLoggedIn, isAdmin, createNotice);

/**
 * @swagger
 * /api/notice/update/:noticeId:
 *   put:
 *     description: update a notice in database
 *     responses:
 *       200:
 *         description: user should be admin
 */
Router.put("/api/notice/update/:noticeId", isLoggedIn, isAdmin, updateNotice);

/**
 * @swagger
 * /api/notice/get/:noticeId:
 *   get:
 *     description: Get a notice from database
 *     responses:
 *       200:
 *         description: return a notice
 */
Router.get("/api/notice/get/:noticeId", isLoggedIn, isAdmin, getNotice);

/**
 * @swagger
 * /api/notice/getAll:
 *   get:
 *     description: Get all notices from database
 *     responses:
 *       200:
 *         description: get all the notices
 */
Router.get("/api/notice/getAll", isLoggedIn, isMember, getAllNotice);

/**
 * @swagger
 * /api/notice/delete/:noticeId:
 *   delete:
 *     description: delete a notice from database
 *     responses:
 *       200:
 *         description: delete notice
 */
Router.delete(
  "/api/notice/delete/:noticeId",
  isLoggedIn,
  isAdmin,
  deleteNotice
);

// program routes

/**
 * @swagger
 * /api/program/create:
 *   post:
 *     description: create a new program
 *     responses:
 *       200:
 *         description: new program create
 */
Router.post("/api/program/create", isLoggedIn, isAdmin, createProgram);

/**
 * @swagger
 * /api/program/update/:programId:
 *   put:
 *     description: update an existing program
 *     responses:
 *       200:
 *         description: return updated notice
 */
Router.put(
  "/api/program/update/:programId",
  isLoggedIn,
  isAdmin,
  updateProgram
);

/**
 * @swagger
 * /api/program/get/:programId
 *   get:
 *     description: get an existing program
 *     responses:
 *       200:
 *         description: return retreived notice
 */
Router.get("/api/program/get/:programId", isLoggedIn, isAdmin, getProgram);

/**
 * @swagger
 * /api/program/getAll
 *   get:
 *     description: get an existing program
 *     responses:
 *       200:
 *         description: return retreived notices
 */
Router.get("/api/program/getAll", getAllProgram);

/**
 * @swagger
 * /api/program/delete/:programId
 *   delete:
 *     description: delete an existing program
 *     responses:
 *       200:
 *         description: return deleted notice
 */
Router.delete(
  "/api/program/delete/:programId",
  isLoggedIn,
  isAdmin,
  deleteProgram
);

module.exports = Router;
