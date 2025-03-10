const Advertisement = require("../../models/Advertisement");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadAdvertisement = async (req, res) => {
  try {
    const { title, brand } = req.body;
    const videoFile = req.file;

    // Upload video to Cloudinary
    const result = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: "video",
    });

    // Save advertisement to the database
    const newAd = new Advertisement({
      title,
      videoUrl: result.secure_url,
      brand,
    });
    await newAd.save();

    res.status(201).json({
      success: true,
      data: newAd,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading the advertisement.",
    });
  }
};

const getAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find();
    res.status(200).json({
      success: true,
      data: ads,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching advertisements.",
    });
  }
};

const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, brand } = req.body;

    const updatedAd = await Advertisement.findByIdAndUpdate(
      id,
      { title, brand },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedAd,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the advertisement.",
    });
  }
};

module.exports = { uploadAdvertisement, getAdvertisements, updateAdvertisement };