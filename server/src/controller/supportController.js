import supportService from '../../service/supportService.js';

const getAllSupports = async (req, res) => {
  try {
    const supports = await supportService.getAllSupports();
    res.status(200).json(supports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSupportById = async (req, res) => {
  try {
    const support = await supportService.getSupportById(req.params.id);
    if (!support) return res.status(404).json({ error: 'Support not found' });
    res.status(200).json(support);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSupport = async (req, res) => {
  try {
    const support = await supportService.createSupport(req.body);
    res.status(201).json(support);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSupport = async (req, res) => {
  try {
    const support = await supportService.updateSupport(req.params.id, req.body);
    res.status(200).json(support);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSupport = async (req, res) => {
  try {
    await supportService.deleteSupport(req.params.id);
    res.status(204).json({ message: 'Support deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllSupports,
  getSupportById,
  createSupport,
  updateSupport,
  deleteSupport,
};