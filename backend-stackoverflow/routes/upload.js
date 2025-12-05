const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

router.post("/", upload.single("image"), (req, res) => {
  try {
    return res.json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

router.post("/multiple", upload.array("files", 10), (req, res) => {
  try {
    const uploadedFiles = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
      originalName: file.originalname,
    }));

    return res.json({
      success: true,
      files: uploadedFiles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

module.exports = router;
