import Task from '../models/Task.js';
import mongoose from 'mongoose';

export const createTask = async (req, res) => {
  try {
    const { userId, title, description, courseId, courseName, dueDate, priority, status } = req.body;

 if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({
    success: false,
    message: 'Valid userId is required'
  });
}

if (!title) {
  return res.status(400).json({
    success: false,
    message: 'Title is required'
  });
}

    const task = await Task.create({
      userId,
      title,
      description,
      courseId,
      courseName,
      dueDate,
      priority,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { userId, status, priority } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({
    success: false,
    message: 'Valid userId is required'
  });
}

    const filter = { userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid task ID'
  });
}

if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({
    success: false,
    message: 'Valid userId is required'
  });
}

    const task = await Task.findOne({
      _id: req.params.id,
      userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid task ID'
  });
}

if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({
    success: false,
    message: 'Valid userId is required'
  });
}

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or update not allowed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid task ID'
  });
}

if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({
    success: false,
    message: 'Valid userId is required'
  });
}

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or delete not allowed'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid task ID'
  });
}

if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({
    success: false,
    message: 'Valid userId is required'
  });
}

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'status is required'
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};