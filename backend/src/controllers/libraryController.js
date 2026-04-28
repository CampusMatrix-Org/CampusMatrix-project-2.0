import File from "../models/File.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const newFile = await File.create({
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      subject: req.body.subject || "General",
      userId: req.user.id
    });

    res.status(201).json({ success: true, data: newFile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id });
    res.status(200).json({ success: true, data: files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};