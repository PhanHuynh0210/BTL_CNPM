import db from '../models/index.js';

const getAllDevices = async () => {
  try {
    return await db.Device.findAll({
      include: [{ model: db.Room, as: 'Room' }], // Adjust based on actual association
    });
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const getDeviceById = async (id) => {
  try {
    return await db.Device.findByPk(id, {
      include: [{ model: db.Room, as: 'Room' }],
    });
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const createDevice = async (deviceData) => {
  try {
    return await db.Device.create(deviceData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const updateDevice = async (id, deviceData) => {
  try {
    const device = await db.Device.findByPk(id);
    if (!device) throw new Error('Device not found');
    return await device.update(deviceData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const deleteDevice = async (id) => {
  try {
    const device = await db.Device.findByPk(id);
    if (!device) throw new Error('Device not found');
    return await device.destroy();
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

export default {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
};