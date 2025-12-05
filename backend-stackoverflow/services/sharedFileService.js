const SharedFile = require("../models/SharedFile");

// Lấy tất cả folder
exports.getAll = async () => {
  return SharedFile.find()
    .populate("createdBy", "username")
    .populate("files.uploadedBy", "username")
    .populate("comments.userId", "username")
    .sort({ createdAt: -1 });
};

// Tạo folder mới
exports.createFolder = async (data) => {
  return SharedFile.create(data);
};

// Upload file vào folder
exports.uploadFiles = async (folderId, files, userId) => {
  const formattedFiles = files.map((file) => ({
    fileName: file.originalName,
    fileUrl: file.url,
    uploadedBy: userId,
  }));

  return SharedFile.findByIdAndUpdate(
    folderId,
    { $push: { files: { $each: formattedFiles } } },
    { new: true }
  ).populate("files.uploadedBy", "username");
};
// Xoá file khỏi folder
exports.deleteFile = async (folderId, fileUrl) => {
  return SharedFile.findByIdAndUpdate(
    folderId,
    { $pull: { files: { fileUrl } } },
    { new: true }
  );
};

exports.deleteFolder = async (folderId) => {
  return SharedFile.findByIdAndDelete(folderId);
};
