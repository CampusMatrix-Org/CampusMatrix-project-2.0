import Folder from '../models/Folder.js';
import Document from '../models/Document.js';

// --- FOLDERS ---

export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id });
    const formatted = folders.map(f => ({
      id: f._id,
      name: f.name,
      files: f.filesCount,
      size: f.size
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Folder name is required' });
    }

    const folder = await Folder.create({
      name,
      userId: req.user.id
    });

    res.status(201).json({
      id: folder._id,
      name: folder.name,
      files: folder.filesCount,
      size: folder.size
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    await Folder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ success: true, message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};