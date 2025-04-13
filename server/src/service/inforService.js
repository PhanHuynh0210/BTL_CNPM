import db from '../models/index.js';

const getAllInfors = async () => {
  try {
    return await db.Infor.findAll();
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const getInforById = async (id) => {
  try {
    return await db.Infor.findByPk(id);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const createInfor = async (inforData) => {
  try {
    return await db.Infor.create(inforData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const updateInfor = async (id, inforData) => {
  try {
    const infor = await db.Infor.findByPk(id);
    if (!infor) throw new Error('Infor not found');
    return await infor.update(inforData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const deleteInfor = async (id) => {
  try {
    const infor = await db.Infor.findByPk(id);
    if (!infor) throw new Error('Infor not found');
    return await infor.destroy();
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

export default {
  getAllInfors,
  getInforById,
  createInfor,
  updateInfor,
  deleteInfor,
};