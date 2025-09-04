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

module.exports = router;
