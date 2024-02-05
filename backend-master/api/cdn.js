const childprocess = require('child_process');
require('dotenv').config({path: '../.env'})
// Only use the v2 of cloudinary
const cloudinary = require('cloudinary').v2;

const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_KEY;

// Cloudinary API Key
cloudinary.config({ 
  cloud_name: 'dzwyf9kn9',
  api_key: '118711847278919',
  api_secret: 'lfurnA-tUrQLTFGNeZ1f4ysn1gk',
});


// Handles the image uploads to Cloudinary CDN
async function uploadImageCdn( filename ) {

    const result =await cloudinary.uploader.upload(`./image_uploads/${filename}`,
    { public_id: `${filename}` } );


    // perform file deletion
    
    const ls = await childprocess.spawn('rm', [`./image_uploads/${filename}`]);

    
    return result;
}


// Export the functions
module.exports = {
    uploadImageCdn
}


