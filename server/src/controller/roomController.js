import roomService from "../service/roomService";

const createRoom = async (req, res) => {
    try {
        console.log("Received room data:", req.body);  

        const room = req.body;  
        const result = await roomService.addRoom(room);  
        res.redirect("/home");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "An error occurred while creating the room." });
    }
};


const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomService.getRoomList();
        res.status(200).json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "An error occurred while fetching the rooms." });
    }
};

const getRoom = async (req, res) => {
    try {
        const room = await roomService.getRoomById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        res.status(200).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || "An error occurred while fetching the room." });
    }
};

const editRoom = async (req, res) => {
    try {
      const roomId = req.body.room_id;
      const updatedRoomData = {
        capacity: req.body.capacity,
        location: req.body.location,
        status: req.body.room_status 
      };
      
      const updatedRoom = await roomService.updateRoom(roomId, updatedRoomData);
      
      if (!updatedRoom) {
        return res.status(404).json({ error: "Phòng không tồn tại hoặc không có thay đổi." });
      }
      res.redirect("/home"); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Lỗi khi cập nhật phòng." });
    }
  };


  const lockRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        const result = await roomService.lockRoom(roomId);
        if (!result) {
            return res.status(404).json({ error: "Không tìm thấy phòng." });
        }
        res.redirect("/home");
    } catch (error) {
        console.error("Lỗi khi khóa phòng:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || "Lỗi xảy ra khi khóa phòng." });
        }
    }
};

  

export default {
    createRoom,
    getAllRooms,
    getRoom,
    editRoom,
    lockRoom
};
