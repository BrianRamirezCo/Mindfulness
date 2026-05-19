const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return result;
}

function generateEbookDownloadUrl(publicId) {
  const expirySeconds = parseInt(process.env.EBOOK_LINK_EXPIRY) || 86400;
  const expiresAt = Math.floor(Date.now() / 1000) + expirySeconds;

  const url = cloudinary.utils.private_download_url(publicId, "pdf", {
    expires_at: expiresAt,
    attachment: true,
  });

  return { url, expiresAt: new Date(expiresAt * 1000) };
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil, generateEbookDownloadUrl };
