import db from '../models/index.js';

const getAllBookings = async () => {
  try {
    return await db.Booking.findAll({
      include: [
        { model: db.Room, as: 'room' },
        { model: db.Users, as: 'user' },
      ],
    });
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const getBookingById = async (id) => {
  try {
    return await db.Booking.findByPk(id, {
      include: [
        { model: db.Room, as: 'room' },
        { model: db.Users, as: 'user' },
      ],
    });
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const createBooking = async (bookingData) => {
  try {
    return await db.Booking.create(bookingData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const updateBooking = async (id, bookingData) => {
  try {
    const booking = await db.Booking.findByPk(id);
    if (!booking) throw new Error('Booking not found');
    return await booking.update(bookingData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const deleteBooking = async (id) => {
  try {
    const booking = await db.Booking.findByPk(id);
    if (!booking) throw new Error('Booking not found');
    return await booking.destroy();
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

export default {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};