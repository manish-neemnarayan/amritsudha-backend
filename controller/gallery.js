const cloudinary = require("../util/cloudinary");
const Gallery = require("../model/gallerySchema");
const asyncHandler = require("../util/asyncHandler");
const CustomError = require("../util/customError");

/*********************************************************************

* * @Upload_Image
* * @route http:/localhost:4000/api/image/upload
* * @method Post
* * @description User will be able upload the image
* * @parameters title, description
* * @return Image-Url with all the info

******************************************************************************/
exports.uploadImage = asyncHandler(async (req, res) => {
    try {
        const {title, description} = req.body;
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        // Create new gallery image
        let image = new Gallery({
        title,
        description,
        avatar: result.secure_url,
        cloudinary_id: result.public_id,
    });

        // Save user
        await image.save();
        res.json(image);
        } 
        catch (err) {
        console.log(err);
}})

/*********************************************************************

* * @Delete_Image
* * @route http:/localhost:4000/api/image/delete/:image_id
* * @method Delete
* * @description User will be able delete the image
* * @parameters 
* * @return Success Message

******************************************************************************/

exports.deleteImage = asyncHandler(async (req, res) => {
    try {
        // Find image by id
        let image = await Gallery.findById(req.params.image_id);
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(image.cloudinary_id);
        // Delete image from db
        await image.remove();
        res.json({
            success: true,
            message: "Image is deleted successfully"
        });
      } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Image deletion is not successfull"
        })
      }
})

/*********************************************************************

* * @Get_Image
* * @route http:/localhost:4000/api/image/getAllImages
* * @method get
* * @description Getting all the images
* * @parameters 
* * @return Images

******************************************************************************/

exports.getImages = asyncHandler(async (_req, res) => {
    // retreive all the images
    const getImages = await Gallery.find();

    if(!getImages) throw new CustomError("Images are not found", 500);

    res.status(200).json({
        success: true,
        images: getImages
    })
})