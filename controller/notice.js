const Notice = require("../model/noticeSchema");
const asyncHandler = require("../util/asyncHandler");
const CustomError = require("../util/customError");

// ROUTES NOTICES

/*********************************************************************

* * @createNotice
* * @route http:/localhost:4000/api/notice/create/:userId
* * @method Post
* * @description Creating a new notice in database
* * @parameters title, message
* * @return notice, success-message

******************************************************************************/

exports.createNotice = asyncHandler(async (req, res) => {
    try 
        {// Extract data from client
        const {title, message} = req.body;

        // check if data is there
        if(!title || !message) {
            throw new CustomError("Title and Message fields are not specified", 400);
        }

        // TODO: CHECK IF USER LOGGED IN, IT'LL BE HANDLED BY ISLOGGEDIN MIDDLEWARE

        const notice = await Notice.create({
            title,
            message
        })

        res.status(200).json({
            success: true,
            notice
        })

    } catch(error) {
        console.log(error);
        throw new CustomError("Error is found in create notice route", 405);
    }
})

/*********************************************************************

* * @updateNotice
* * @route http:/localhost:4000/api/notice/update/:noticeId
* * @method Put
* * @description Updating a notice in database
* * @parameters title, message
* * @return updated notice

******************************************************************************/

exports.updateNotice = asyncHandler(async (req, res) => {
    try 
        {// Extract data from client
        const {title, message} = req.body;
        const {noticeId} = req.params;

        // // check if data is there
        // if(!title && !message) {
        //     throw new CustomError("Title and Message fields are not specified", 400);
        // }

        // TODO: CHECK IF USER LOGGED IN, IT'LL BE HANDLED BY ISLOGGEDIN MIDDLEWARE

        const notice = await Notice.findByIdAndUpdate(noticeId, {title, message}, {new:true});

        res.status(200).json({
            success: true,
            message: "Notice is updated successfully",
            notice
        })

    } catch(error) {
        console.log(error);
        throw new CustomError("Error is found in update notice route", 405);
    }
})


/*********************************************************************

* * @getNotice
* * @route http:/localhost:4000/api/notice/get/:noticeId
* * @method get
* * @description Get a notice in database
* * @parameters 
* * @return requested notice

******************************************************************************/

exports.getNotice = asyncHandler(async (req, res) => {
    try {
        const {noticeId} = req.params;

        const notice = await Notice.findById(noticeId);
    
        if(!notice) throw new CustomError("Notice is not found", 400);
    
        res.status(200).json({
            success: true,
            notice
        })
    } catch (error) {
        console.log(error);
        throw new CustomError("Error is found in get notice route", 405);
    }
}) 

/*********************************************************************

* * @getAllNotice
* * @route http:/localhost:4000/api/notice/getAll
* * @method get
* * @description Get all notices in database
* * @parameters 
* * @return notices

******************************************************************************/

exports.getAllNotice = asyncHandler(async (_req, res) => {
    try {
        const notices = await Notice.find();
    
        if(!notices) throw new CustomError("Notices are not found", 400);
    
        res.status(200).json({
            success: true,
            notices
        })
    } catch (error) {
        console.log(error);
        throw new CustomError("Error is found in getAll notice route", 405);
    }
}) 

/*********************************************************************

* * @deleteNotice
* * @route http:/localhost:4000/api/notice/delete/:noticeId
* * @method del
* * @description Delete a requested notice from database
* * @parameters 
* * @return Deletion Success Message

******************************************************************************/

exports.deleteNotice = asyncHandler(async (req, res) => {
    try {
        const {noticeId} = req.params;

        const deletedNotice = await Notice.findByIdAndDelete(noticeId);
    
        res.status(200).json({
            success: true,
            message: 'Notice is deleted successfully',
            deletedNotice
        })
    } catch (error) {
        console.log(error);
        throw new CustomError("Error is found in delete notice route", 405);
    }


})