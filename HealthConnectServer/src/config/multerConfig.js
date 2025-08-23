require('dotenv').config()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Health_Connect_User_Profiles',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: () => {
            return `profile_picture`
        },
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 //Shouldn't be more than 2MB
    },
})

module.exports = upload
