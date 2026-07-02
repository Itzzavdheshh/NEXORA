const express = require("express");
const multer = require("multer");
const supabase = require("../config/supabase");
const authenticate = require("../middleware/auth.middleware");
const logger = require("../utils/logger");

const router = express.Router();

// Multer memory storage configuration for receiving raw files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit avatar images to 2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

router.post("/avatar", authenticate, upload.single("avatar"), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No avatar image file was provided.",
      });
    }

    const userId = req.user.id;
    const fileExtension = file.originalname.split(".").pop();
    const filePath = `${userId}/avatar-${Date.now()}.${fileExtension}`;

    logger.info(`Uploading avatar file to Supabase Storage: ${filePath}`);

    // Upload to Supabase Storage bucket 'avatars'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      // If error is 'Bucket not found', try uploading or throw error
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Resolve public URL
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(uploadData.path);

    const publicUrl = data.publicUrl;

    logger.info(`Avatar uploaded successfully. Updating user table: ${publicUrl}`);

    // Update public.users avatar_url
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Profile avatar link update failed: ${updateError.message}`);
    }

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded and updated successfully.",
      avatarUrl: publicUrl,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
