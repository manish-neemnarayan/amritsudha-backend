const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authRole = require("../util/authRole");
const config = require("../config/index");


const authSchema = mongoose.Schema({
    userName: {
        type: String,
        require: [true, "User Name is required"],
        maxLength: [30, "Name length shouldn't exceed 30 characters"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Minimum length of password should be of 8 digits"],
        // select: false
    },

    role: {
        type: String,
        enum: Object.values(authRole),
        default: authRole.MODERATOR
    },
    token: String,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date

}, {
    timestamps: true
});

// encrypt password on save automatically using mongoose hooks
authSchema.pre("save", async function(next) {
    if(!(this.isModified("password"))) return next()
    // encrypting the password
    this.password = await bcrypt.hash(this.password, 10);
    next()
})


// methods for authSchema or user models for the convenience
authSchema.methods = {
    // compare password
    comparePassword: async function(enteredPassword) {
        const check = await bcrypt.compare(enteredPassword, this.password);
        return check;
    },

    // generate jwt token
    getJwtToken: async function() {
        try {
           const token = jwt.sign({
                _id: this._id,
                role:this.role
            }, config.JWT_SECRET, 
            {
                expiresIn: config.JWT_EXPIRY
            });

            this.token = token;
            return token;
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
        
    },

    // Generate forgot password token
    getForgotPasswordToken: async function() {
        const forgotToken = crypto.randomBytes(20).toString('hex');

        // save to db
        this.forgotPasswordToken = crypto.createHash("sha256").update(forgotToken).digest();
        this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
        // save to user
        return forgotToken;
    }

}

module.exports = mongoose.model("User", authSchema); 
