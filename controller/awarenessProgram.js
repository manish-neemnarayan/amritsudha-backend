const AwarenessProgram = require("../model/awarenessProgramSchema");
const asyncHandler = require("../util/asyncHandler");
const CustomError = require("../util/customError");

// ROUTES FOR AWARENESS PROGRAMMES

/*********************************************************************

* * @createProgram
* * @route http:/localhost:4000/api/program/create/:userId
* * @method Post
* * @description Creating a new program in database
* * @parameters title, message
* * @return program, success-message

******************************************************************************/

exports.createProgram = asyncHandler(async (req, res) => {
    try 
        {// Extract data from client
        const {title, message} = req.body;

        // check if data is there
        if(!title || !message) {
            throw new CustomError("Title and Message fields are not specified", 400);
        }

        // TODO: CHECK IF USER LOGGED IN, IT'LL BE HANDLED BY ISLOGGEDIN MIDDLEWARE

        const program = await AwarenessProgram.create({
            title,
            message
        })

        res.status(200).json({
            success: true,
            program
        })

    } catch(error) {
        console.log(error);
        throw new CustomError("Error is found in create program route", 405);
    }
})

/*********************************************************************

* * @updateProgram
* * @route http:/localhost:4000/api/program/update/:programId
* * @method Put
* * @description Updating a program in database
* * @parameters title, message
* * @return updated program

******************************************************************************/

exports.updateProgram = asyncHandler(async (req, res) => {
    try 
        {// Extract data from client
        const {title, message} = req.body;
        const {programId} = req.params;
        // check if data is there
        if(!title && !message) {
            throw new CustomError("Title and Message fields are not specified", 400);
        }

        // TODO: CHECK IF USER LOGGED IN, IT'LL BE HANDLED BY ISLOGGEDIN MIDDLEWARE

        const program = await AwarenessProgram.findByIdAndUpdate(programId, {title, message}, {new:true});
        res.status(200).json({
            success: true,
            message: "program is updated successfully",
            program
        })

    } catch(error) {
        console.log(error);
        throw new CustomError("Error is found in update program route", 405);
    }
})


/*********************************************************************

* * @getProgram
* * @route http:/localhost:4000/api/program/get/:programId
* * @method get
* * @description Get a program in database
* * @parameters 
* * @return requested program

******************************************************************************/

exports.getProgram = asyncHandler(async (req, res) => {
    try {
        const {programId} = req.params;

        const program = await AwarenessProgram.findById(programId);
    
        if(!program) throw new CustomError("program is not found", 400);
    
        res.status(200).json({
            success: true,
            program
        })
    } catch (error) {
        console.log(error);
        throw new CustomError("Error is found in get program route", 405);
    }
}) 

/*********************************************************************

* * @getAllProgram
* * @route http:/localhost:4000/api/program/getAll
* * @method get
* * @description Get all programs in database
* * @parameters 
* * @return programs

******************************************************************************/

exports.getAllProgram = asyncHandler(async (_req, res) => {
    try {
        const programs = await AwarenessProgram.find();
    
        if(!programs) throw new CustomError("programs are not found", 400);
        res.status(200).json({
            success: true,
            programs
        })
    } catch (error) {
        console.log(error);
        throw new CustomError("Error is found in getAll program route", 405);
    }
}) 

/*********************************************************************

* * @deleteProgram
* * @route http:/localhost:4000/api/program/delete/:programId
* * @method del
* * @description Delete a requested program from database
* * @parameters 
* * @return Deletion Success Message

******************************************************************************/

exports.deleteProgram = asyncHandler(async (req, res) => {
    try {
        const {programId} = req.params;

        const deletedProgram = await AwarenessProgram.findByIdAndDelete(programId);
    
        res.status(200).json({
            success: true,
            message: 'program is deleted successfully',
            deletedProgram
        })
    } catch (error) {
        console.log(error);
        throw new CustomError("Error is found in delete program route", 405);
    }


})