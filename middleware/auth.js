const User = require("../model/authSchema");
const JWT = require("jsonwebtoken") ;
const CustomError = require("../util/customError") ;
const asyncHandler = require("../util/asyncHandler") ;
const config = require("../config/index") ;

// Middleware for checking if user is logged in 
exports.isLoggedIn = asyncHandler(async (req, _res, next) => {
    let token;
    if(req.cookies.Token ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer")))
      {
        token = req.cookies.Token || req.headers.authorization.split(" ")[1];
      }
      
      console.log(token);
    if(!token) {
        throw new CustomError("You are not authorized", 401);
    }

    try {
        const decodedJWTPayload = JWT.verify(token, config.JWT_SECRET);
        // _id, find user based on id, set this in req.user
        req.user = await User.findById(decodedJWTPayload._id, "name email role");
        return next()
    } catch (error) {
      console.log(error)
        throw new CustomError("Error in loggedIn middleware", 500);
    }
})

// Middleware for checking if user is admin 
exports.isAdmin = asyncHandler(async (req, _res, next) => {
  const {role} = req.user;
  if(role !== "ADMIN") throw new CustomError("You are not an admin, you are not authorized to make changes", 405);
  return next();
})

// Middleware for checking if user is member 
exports.isMember = asyncHandler(async (req, _res, next) => {
  const {role} = req.user;
  if((role !== "ADMIN") && (role !== "MEMBER")) throw new CustomError("You are not an member/admin, you are not authorized to access this page", 405);
  return next();
})

exports.ignoreFavicon = asyncHandler((req, res, next) => {
  if (req.originalUrl.includes('favicon.ico')) {
      res.status(204).end()
    }
  next();
})