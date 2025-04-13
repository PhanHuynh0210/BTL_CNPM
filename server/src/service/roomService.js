import db from '../models/index.js';

const getAllRooms = async () => {
  try {
    return await db.Room.findAll();
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const getRoomById = async (id) => {
  try {
    return await db.Room.findByPk(id);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const createRoom = async (roomData) => {
  try {
    return await db.Room.create(roomData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const updateRoom = async (id, roomData) => {
  try {
    const room = await db.Room.findByPk(id);
    if (!room) throw new Error('Room not found');
    return await room.update(roomData);
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

const deleteRoom = async (id) => {
  try {
    const room = await db.Room.findByPk(id);
    if (!room) throw new Error('Room not found');
    return await room.destroy();
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
};

export default {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};