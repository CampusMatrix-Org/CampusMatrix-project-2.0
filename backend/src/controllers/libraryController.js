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

// --- DOCUMENTS ---

export const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id });
    const formatted = docs.map(d => ({
      id: d._id,
      name: d.name,
      size: d.size,
      modified: d.updatedAt.toISOString().split('T')[0],
      owner: d.owner,
      type: d.type
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// uplaod Documents 

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    // Convert bytes to readable MB/KB string
    const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(2);
    const formattedSize = sizeInMB > 0.1 ? `${sizeInMB} MB` : `${(req.file.size / 1024).toFixed(1)} KB`;

    // File type enum mapping (Fix for validation error)
    let docType = 'pdf';
    const ext = req.file.originalname.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(ext)) {
      docType = 'image';
    } else if (['doc', 'docx'].includes(ext)) {
      docType = 'docx';
    } else if (ext === 'pdf') {
      docType = 'pdf';
    }

    const doc = await Document.create({
      name: req.body.name || req.file.originalname,
      fileUrl: req.file.path, 
      owner: req.user?.name || 'You',
      type: docType,          
      userId: req.user.id,
      folderId: req.body.folderId || null
    });

    if (req.body.folderId) {
      await Folder.findByIdAndUpdate(req.body.folderId, { $inc: { filesCount: 1 } });
    }

    res.status(201).json({
      id: doc._id,
      name: doc.name,
      size: doc.size,
      modified: doc.updatedAt ? doc.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      owner: doc.owner,
      type: doc.type
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};