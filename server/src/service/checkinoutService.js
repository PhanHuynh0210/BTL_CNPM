import db from '../models/index.js';

const getAllCheckinouts = async () => {
  try {
    return await db.CheckInOut.findAll({
      include: [
        { model: db.Users, as: 'user' },
        { model: db.Booking, as: 'booking' },
      ],
    });
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const getCheckinoutById = async (id) => {
  try {
    return await db.CheckInOut.findByPk(id, {
      include: [
        { model: db.Users, as: 'user' },
        { model: db.Booking, as: 'booking' },
      ],
    });
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const createCheckinout = async (checkinoutData) => {
  try {
    return await db.CheckInOut.create(checkinoutData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const updateCheckinout = async (id, checkinoutData) => {
  try {
    const checkinout = await db.CheckInOut.findByPk(id);
    if (!checkinout) throw new Error('CheckInOut not found');
    return await checkinout.update(checkinoutData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const deleteCheckinout = async (id) => {
  try {
    const checkinout = await db.CheckInOut.findByPk(id);
    if (!checkinout) throw new Error('CheckInOut not found');
    return await checkinout.destroy();
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

export default {
  getAllCheckinouts,
  getCheckinoutById,
  createCheckinout,
  updateCheckinout,
  deleteCheckinout,
};