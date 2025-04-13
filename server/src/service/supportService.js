import db from '../models/index.js';

const getAllSupports = async () => {
  try {
    return await db.Support.findAll({
      include: [{ model: db.Users, as: 'user' }],
    });
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const getSupportById = async (id) => {
  try {
    return await db.Support.findByPk(id, {
      include: [{ model: db.Users, as: 'user' }],
    });
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const createSupport = async (supportData) => {
  try {
    return await db.Support.create(supportData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const updateSupport = async (id, supportData) => {
  try {
    const support = await db.Support.findByPk(id);
    if (!support) throw new Error('Support not found');
    return await support.update(supportData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const deleteSupport = async (id) => {
  try {
    const support = await db.Support.findByPk(id);
    if (!support) throw new Error('Support not found');
    return await support.destroy();
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

export default {
  getAllSupports,
  getSupportById,
  createSupport,
  updateSupport,
  deleteSupport,
};