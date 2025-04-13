import deviceService from '../../service/deviceService.js';

const getAllDevices = async (req, res) => {
  try {
    const devices = await deviceService.getAllDevices();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDeviceById = async (req, res) => {
  try {
    const device = await deviceService.getDeviceById(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createDevice = async (req, res) => {
  try {
    const device = await deviceService.createDevice(req.body);
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDevice = async (req, res) => {
  try {
    const device = await deviceService.updateDevice(req.params.id, req.body);
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDevice = async (req, res) => {
  try {
    await deviceService.deleteDevice(req.params.id);
    res.status(204).json({ message: 'Device deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
};