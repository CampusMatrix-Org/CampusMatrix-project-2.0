import Task from '../models/Task.js';

const ALLOWED_FIELDS = [
  'title', 'description', 'type', 'target',
  'courseId', 'courseName', 'dueDate', 'priority', 'status'
];

// userId, _id wage fields client ta wenas karanna denne nෑ
const pickFields = (body) =>
  Object.fromEntries(Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key)));

const handleError = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ success: false, message: error.message });
  }
  console.error(error);
  return res.status(500).json({ success: false, message: 'Server error' });
};

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...pickFields(req.body), userId: req.user.id });
    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (error) {
    handleError(res, error);
  }
};

export const getTasks = async (req, res) => {
  try {
    const { status, priority, type } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;

    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    handleError(res, error);
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    handleError(res, error);
  }
};

// PUT saha PATCH dekatama meka
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      pickFields(req.body),
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};