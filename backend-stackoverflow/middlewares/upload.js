const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const ext = file.originalname.split('.').pop().toLowerCase();

    const imageExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'];
    const videoExt = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

    let resource_type = 'raw'; // default raw
    if (imageExt.includes(ext)) resource_type = 'image';
    if (videoExt.includes(ext)) resource_type = 'video';

    // với raw (docx, pdf, zip...), Cloudinary không cần allowed_formats
    const params = {
      folder: 'shared-files',
      resource_type
    };

    return params;
  },
});

module.exports = multer({ storage });
