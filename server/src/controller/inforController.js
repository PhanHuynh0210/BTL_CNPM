import inforService from '../../service/inforService.js';

const getAllInfors = async (req, res) => {
  try {
    const infors = await inforService.getAllInfors();
    res.status(200).json(infors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInforById = async (req, res) => {
  try {
    const infor = await inforService.getInforById(req.params.id);
    if (!infor) return res.status(404).json({ error: 'Infor not found' });
    res.status(200).json(infor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInfor = async (req, res) => {
  try {
    const infor = await inforService.createInfor(req.body);
    res.status(201).json(infor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateInfor = async (req, res) => {
  try {
    const infor = await inforService.updateInfor(req.params.id, req.body);
    res.status(200).json(infor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteInfor = async (req, res) => {
  try {
    await inforService.deleteInfor(req.params.id);
    res.status(204).json({ message: 'Infor deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllInfors,
  getInforById,
  createInfor,
  updateInfor,
  deleteInfor,
};