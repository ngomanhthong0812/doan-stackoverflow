const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const auth = require("../middlewares/authMiddleware");

router.get("/", auth, statsController.getStats);

module.exports = router;
