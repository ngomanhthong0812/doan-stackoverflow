const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

// Hàm bỏ dấu + chuẩn hoá tên file
const normalizeFileName = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/[^a-zA-Z0-9]/g, "-") // ký tự đặc biệt → "-"
    .replace(/-+/g, "-") // gom nhiều "-" thành 1
    .replace(/^-|-$/g, "") // xoá "-" đầu/cuối
    .toLowerCase();

// Hàm kiểm tra file trùng trên Cloudinary
const getUniquePublicId = async (baseName) => {
  let publicId = baseName;
  let counter = 1;

  while (true) {
    try {
      await cloudinary.api.resource(`shared-files/${publicId}`);
      publicId = `${baseName}_${counter}`;
      counter++;
    } catch (error) {
      console.log(error);
      return publicId;
    }
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split(".").pop().toLowerCase();

    const imageExt = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg"];
    const videoExt = ["mp4", "mov", "avi", "mkv", "webm"];

    let resource_type = "raw";
    if (imageExt.includes(ext)) resource_type = "image";
    if (videoExt.includes(ext)) resource_type = "video";

    // chuẩn hóa tên file
    const originalNameNoExt = file.originalname.replace(/\.[^.]+$/, "");
    const cleanedName = normalizeFileName(originalNameNoExt);

    // kiểm tra trùng → tạo tên unique
    const uniquePublicId = await getUniquePublicId(cleanedName);

    return {
      folder: "shared-files",
      resource_type,
      format: ext,
      public_id: uniquePublicId,
    };
  },
});

module.exports = multer({ storage });
