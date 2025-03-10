const express = require("express");
const multer = require("multer");
const { uploadAdvertisement, getAdvertisements, updateAdvertisement } = require("../../controllers/admin/advertisement-controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("video"), uploadAdvertisement);
router.get("/", getAdvertisements);
router.put("/:id", updateAdvertisement);

module.exports = router;