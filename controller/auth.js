const User = require("../model/authSchema");
const asyncHandler = require("../util/asyncHandler");
const CustomError = require("../util/customError");
const crypto = require("crypto");
const mailHelper = require("../util/mailHelper");

// cookie options
const cookieOptions = {
    // expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 ),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        domain: 'https://amritsudha-backend-server123.onrender.com',
        path: '/',
        expires: new Date(Date.now() + 8 * 3600000) // cookie will expire in 8 hours
}

// ROUTES

/*********************************************************************

* * @signup 
* * @route http:/localhost:4000/api/auth/signup
* * @method Post
* * @description User signup controller for creating a new user
* * @parameters userName, email, password, role
* * @return User object

******************************************************************************/

exports.signup = asyncHandler(async (req, res) => {
    // getting data from body or frontend
    const {userName, email, password, role} = req.body;
    // checking if data is specified in fields
    if(!userName && !email && !password && !role) {
        throw new CustomError("Fill all the fields properly", 400)
    }

    // check if user exist
    const userExist = await User.findOne({email});
    if(userExist) throw new CustomError("User is already existed", 401);

    // lets create a new user then
    const user = User.create({
        userName,
        email,
        password,
        role
    });
    // generate a token
    const token = user.then(res => res.getJwtToken()).then(res => res);

    // making password undefined before sending the json response
    user.then(res => {
        res.password = undefined
    });
    
    // sending a response with cookie having token
    res.cookie("Token", token, cookieOptions);

    // sending res json
    res.status(200).json({
        success: true,
        user: await user,
    })

})

/*********************************************************************

* * @login 
* * @route http:/localhost:4000/api/auth/login
* * @method Post
* * @description User login controller to login a user
* * @parameters email, password
* * @return User object

******************************************************************************/

exports.login = asyncHandler(async (req, res) => {
   // getting data from body or frontend
   const {email, password} = req.body;
   // checking if data is specified in fields
   if(!email && !password) {
       throw new CustomError("Fill all the fields properly", 400)
   }

   // check if user exist
   const user = await User.findOne({email});
   if(!user) {
       res.clearCookie("Token")
       
       throw new CustomError("You are not Registered", 401); 
   }
   // compare passwords
   const matchedPasswords = await user.comparePassword(password);

   // passwords are not matched
   if(!matchedPasswords) {
       res.clearCookie("Token")

       throw new CustomError("Credentials are not matched, Try Again :(", 402)
   };


   if(matchedPasswords) {
       const token = await user.getJwtToken();
       user.password = undefined;
    //    user.token = undefined;
       res.cookie("Token", token, cookieOptions)
       res.status(200).json({
           success: true,
           user
       });
   }

})

/*********************************************************************

* * @logout 
* * @route http:/localhost:4000//api/auth/logout
* * @method Post
* * @description User logout by clearing user cookies
* * @parameters 
* * @return success message

******************************************************************************/

exports.logout = asyncHandler(async (_req, res) => {
    // just clear the cookikes and set expiry to now
    res.cookie("Token", null, {
        httpOnly: true,
        expiresIn: new Date(Date.now())
    })

    res.status(200).json({
        success: true,
        message: "Successfully Logged Out"
    })
})

/*********************************************************************

* * @Get All User
* * @route http:/localhost:4000/api/auth/getAllUser
* * @method Get
* * @description Retrieve all signed up user
* * @parameters 
* * @return Users

******************************************************************************/
exports.getAllUser = asyncHandler(async (_req, res) => {
    // get all users from db
    const users = await User.find();

    if(!users) throw new CustomError("No User is found in database", 400);

    res.status(200).json({
        success: true,
        users
    })
})

/*********************************************************************

* * @Get All User
* * @route http:/localhost:4000/api/auth/get/user/:userId
* * @method Get
* * @description Retrieve signed up user based on id
* * @parameters 
* * @return User

******************************************************************************/

exports.getUser = asyncHandler(async (req, res) => {
    try {
        const {userId} = req.params;

        const user = await User.findById(userId);
    
        if(!user) throw new CustomError("Notice is not found", 400);
    
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
        throw new CustomError("Error is found in get notice route", 405);
    }
}) 

/*********************************************************************

* * @Update User
* * @route http:/localhost:4000/api/auth/user/update/:userId
* * @method put
* * @description Update the user into the database
* * @parameters name email role password
* * @return updated user

******************************************************************************/
exports.updateUser = asyncHandler(async (req, res) => {
    try {
        // exrtracting data from the request body
        const {userName, email, role, password} = req.body;
        const {userId} = req.params;

         // find user by id and update respective fields
        const user = await User.findByIdAndUpdate(userId, {userName, email, password, role}, {
            new: true
        });

        // send response
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.send({
            message: "Error happended do something yaar",
            error
        })
    }
    

})

/*********************************************************************

* * @Delete User
* * @route http:/localhost:4000/api/auth/user/delete/:userId
* * @method delete
* * @description Delete user from database
* * @parameters 
* * @return Success Message

******************************************************************************/
exports.deleteUser = asyncHandler(async (req, res) => {
    // getting user id from params in URL
    const {userId} = req.params;

    await User.findByIdAndDelete(userId)

    res.status(200).json({
        success: true,
        message: "User is removed successfully"
    });
})


/*********************************************************************

* * @FORGOT_PASSWORD 
* * @route http:/localhost:4000//api/auth/password/forgot
* * @method Post
* * @description User will submit email and we will generate a token
* * @parameters email
* * @return success message "Email sent"

******************************************************************************/

exports.forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body;

    // check if user exist
    const user = await User.findOne({email});
    if(!user) throw new CustomError("User is not found", 403);

    // generate reset token
    const resetToken = await user.getForgotPasswordToken()
    // save to user document but without validating all required data of user schema
    await user.save({validateBeforeSave: false});

    // reset url as a res in mail
    const resetUrl = 
    `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`;

    const text = `Your password reset url is 
    \n\n ${resetUrl} \n\n`;

    try {

        await mailHelper({
            email: user.email,
            subject: "Reset Password URL",
            text
        })

        res.status(200).json({
            success: true,
            message: `Successfully Email is sent to the ${user.email}`
        })
        
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({validateBeforeSave: false});
        throw new CustomError(error.message || "Email sending failure", 404)
    }

})

/*********************************************************************

* * @RESET_PASSWORD 
* * @route http:/localhost:4000//api/auth/password/reset/:resetToken
* * @method Post
* * @description User will be able to reset password based on url token
* * @parameters token from url, password and confirm password
* * @return User obj

******************************************************************************/

exports.resetPassword = asyncHandler(async (req, res) => {
    const {resetToken} = req.params;
    const {password, confirmPassword} = req.body;

    const resetPasswordToken = crypto.
    createHash("sha256").
    update(resetToken).
    digest("hex")

    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    })

    if(!user){
        throw new CustomError("Password token is invalid", 400)
    }
    if(password !== confirmPassword){
        throw new CustomError("Password and confirm password is not matched", 400)
    }

    // update the password
    user.password = password;
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    user.save();

    // create a token and send to user
    const token = user.getJwtToken();

    res.cookie(
        "token",
        token,
        cookieOptions
    )

    res.status(200).json({
        success: true,
        user
    })

})

