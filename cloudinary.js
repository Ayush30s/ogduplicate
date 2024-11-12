const cloudinary = require("cloudinary").v2;

const fun = async (path) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.ghj2avDgbHGv81YNAzo95uvpnHg,
  });

  const uploadResult = await cloudinary.uploader.upload(path);
  return uploadResult;
};

// fun("./Public/uploads/1725900255150download (4).jpg");
module.exports = fun;
