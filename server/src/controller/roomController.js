import roomService from '../service/roomService.js';

const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.status(204).json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};