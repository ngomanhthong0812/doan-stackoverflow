const SharedFileService = require("../services/sharedFileService");

exports.getAll = async (req, res) => {
  try {
    const data = await SharedFileService.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFolder = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newFolder = await SharedFileService.createFolder({
      title,
      description,
      createdBy: req.user._id,
    });

    res.json({ success: true, data: newFolder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadFiles = async (req, res) => {
  try {
    const folderId = req.params.id;
    const data = req.body.data;

    const updated = await SharedFileService.uploadFiles(
      folderId,
      data,
      req.user._id
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    await SharedFileService.deleteFolder(folderId);
    res.json({ success: true, message: "Folder deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const folderId = req.params.id;
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res
        .status(400)
        .json({ success: false, message: "fileUrl is required" });
    }

    const updatedFolder = await SharedFileService.deleteFile(folderId, fileUrl);

    if (!updatedFolder) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found" });
    }

    res.json({ success: true, data: updatedFolder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
