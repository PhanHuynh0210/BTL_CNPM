import db from '../models/index.js';

const getAllFeedbacks = async () => {
  try {
    return await db.Feedback.findAll({
      include: [{ model: db.Users, as: 'user' }],
    });
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const getFeedbackById = async (id) => {
  try {
    return await db.Feedback.findByPk(id, {
      include: [{ model: db.Users, as: 'user' }],
    });
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const createFeedback = async (feedbackData) => {
  try {
    return await db.Feedback.create(feedbackData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const updateFeedback = async (id, feedbackData) => {
  try {
    const feedback = await db.Feedback.findByPk(id);
    if (!feedback) throw new Error('Feedback not found');
    return await feedback.update(feedbackData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const deleteFeedback = async (id) => {
  try {
    const feedback = await db.Feedback.findByPk(id);
    if (!feedback) throw new Error('Feedback not found');
    return await feedback.destroy();
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

export default {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};