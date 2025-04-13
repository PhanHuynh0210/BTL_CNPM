import feedbackService from '../service/feedbackService.js';

const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getAllFeedbacks();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFeedbackById = async (req, res) => {
  try {
    const feedback = await feedbackService.getFeedbackById(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.createFeedback(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.updateFeedback(req.params.id, req.body);
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    await feedbackService.deleteFeedback(req.params.id);
    res.status(204).json({ message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
};