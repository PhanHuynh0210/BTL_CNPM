import checkinoutService from '../../service/checkinoutService.js';

const getAllCheckinouts = async (req, res) => {
  try {
    const checkinouts = await checkinoutService.getAllCheckinouts();
    res.status(200).json(checkinouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCheckinoutById = async (req, res) => {
  try {
    const checkinout = await checkinoutService.getCheckinoutById(req.params.id);
    if (!checkinout) return res.status(404).json({ error: 'CheckInOut not found' });
    res.status(200).json(checkinout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCheckinout = async (req, res) => {
  try {
    const checkinout = await checkinoutService.createCheckinout(req.body);
    res.status(201).json(checkinout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCheckinout = async (req, res) => {
  try {
    const checkinout = await checkinoutService.updateCheckinout(req.params.id, req.body);
    res.status(200).json(checkinout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCheckinout = async (req, res) => {
  try {
    await checkinoutService.deleteCheckinout(req.params.id);
    res.status(204).json({ message: 'CheckInOut deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllCheckinouts,
  getCheckinoutById,
  createCheckinout,
  updateCheckinout,
  deleteCheckinout,
};