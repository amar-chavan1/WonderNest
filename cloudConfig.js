const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'WanderNest_uploads_DEV', // This is the folder in your Cloudinary account where images will be stored
        allowed_formats: ['jpeg', 'png', 'jpg', 'gif'], // Allowed file formats
        
    },
});


module.exports={
    cloudinary,
    storage,
}