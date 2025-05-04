import roomService from "../service/roomService"; // Đảm bảo đường dẫn đúng


const createRoom = async (req, res) => {
    try {
        const roomData = {
            capacity: parseInt(req.body.capacity, 10),
            location: req.body.location,
            room_status: req.body.room_status || 'Available',
            devices: req.body.devices, 
            available_seats: req.body.available_seats ? parseInt(req.body.available_seats, 10) : undefined,
            room_type: req.body.room_type 
        };

        console.log("BE Controller: Received data for new room:", roomData);

        if (isNaN(roomData.capacity) || roomData.capacity <= 0) {
             throw new Error("Sức chứa không hợp lệ.");
        }
         if (roomData.available_seats !== undefined && isNaN(roomData.available_seats)) {
              throw new Error("Số chỗ trống phải là một số.");
         }

        const result = await roomService.addRoom(roomData);
        console.log("BE Controller: Room added successfully:", result);
        res.redirect("/home"); // Hoặc trang danh sách phòng

    } catch (error) {
        // 5. Xử lý lỗi
        console.error("BE Controller: Error creating room:", error);
    }
};


const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomService.getRoomList(); // Service đã được cập nhật
        res.status(200).json({ success: true, data: rooms }); // Luôn trả về cấu trúc nhất quán
    } catch (error) {
        console.error("BE Controller: Error fetching all rooms:", error);
        res.status(500).json({ success: false, message: error.message || "Lỗi lấy danh sách phòng." });
    }
};


const getRoom = async (req, res) => {
    try {
        const roomId = parseInt(req.params.id, 10);
        if (isNaN(roomId)) {
             return res.status(400).json({ success: false, message: "ID phòng không hợp lệ." });
        }
        const room = await roomService.getRoomById(roomId); 
        if (!room) {
            return res.status(404).json({ success: false, message: "Không tìm thấy phòng" });
        }
        res.status(200).json({ success: true, data: room });
    } catch (error) {
        console.error("BE Controller: Error fetching room details:", error);
        res.status(500).json({ success: false, message: error.message || "Lỗi lấy chi tiết phòng." });
    }
};


const editRoom = async (req, res) => {
    try {
        const roomId = parseInt(req.body.room_id, 10);
        if (isNaN(roomId)) {
            throw new Error("ID phòng không hợp lệ để cập nhật.");
        }

        // Xử lý devices đặc biệt
        let devices = [];
        if (req.body.devices) {
            // Nếu devices là string, chuyển thành array
            if (typeof req.body.devices === 'string') {
                devices = req.body.devices.split(',').map(d => d.trim()).filter(d => d);
            } 
            // Nếu devices đã là array
            else if (Array.isArray(req.body.devices)) {
                devices = req.body.devices.filter(d => d && d.trim()).map(d => d.trim());
            }
        }

        const updatedRoomData = {
            capacity: req.body.capacity ? parseInt(req.body.capacity, 10) : undefined,
            location: req.body.location || undefined,
            status: req.body.room_status || undefined,
            devices: devices, // Luôn gửi mảng devices, kể cả khi rỗng
            available_seats: req.body.available_seats !== undefined && req.body.available_seats !== ''
                ? parseInt(req.body.available_seats, 10)
                : undefined,
            room_type: req.body.room_type || undefined
        };

        console.log("Cập nhật phòng với dữ liệu:", updatedRoomData);

        const updatedRoom = await roomService.updateRoom(roomId, updatedRoomData);

        if (!updatedRoom) {
            throw new Error("Không tìm thấy phòng để cập nhật.");
        }

        console.log("Cập nhật phòng thành công:", updatedRoom);
        res.redirect("/home");

    } catch (error) {
        console.error(`Lỗi cập nhật phòng ${req.body.room_id}:`, error);
        res.status(500).send(`
            <html><body>
                <h2>Lỗi khi cập nhật phòng</h2>
                <p>${error.message || "Đã có lỗi xảy ra."}</p>
                <a href="/home">Quay lại trang chủ</a>
                <script>setTimeout(() => window.history.back(), 3000);</script>
            </body></html>
        `);
    }
};
const lockRoom = async (req, res) => {
    try {
        const roomId = parseInt(req.params.id, 10); // Lấy ID từ URL
         if (isNaN(roomId)) {
             throw new Error("ID phòng không hợp lệ để khóa.");
         }

        const lockSuccess = await roomService.lockRoom(roomId);

        if (!lockSuccess) {
            return res.status(404).send(`
                <html><body>
                    <h2>Thông báo</h2>
                    <p>Không thể khóa phòng ${roomId}. Phòng không tồn tại hoặc đã ở trạng thái bảo trì.</p>
                    <a href="/home">Quay lại trang chủ</a>
                    <script>setTimeout(() => window.history.back(), 3000);</script>
                </body></html>
            `);
        }
        console.log(`BE Controller: Room ${roomId} locked successfully.`);
        res.redirect("/home"); 

    } catch (error) {
        console.error(`BE Controller: Error locking room ${req.params.id}:`, error);
        // res.redirect('/home');
        res.status(500).send(`
            <html><body>
                <h2>Lỗi khi khóa phòng</h2>
                <p>${error.message || "Đã có lỗi xảy ra."}</p>
                <a href="/home">Quay lại trang chủ</a>
                <script>setTimeout(() => window.history.back(), 3000);</script>
            </body></html>
        `);
    }
};

const listAvailableRooms = async (req, res) => {
    try {
        const availableRooms = await roomService.getAvailableRooms(); 
        res.status(200).json({
            success: true,
            message: "Lấy danh sách phòng trống thành công",
            data: availableRooms
        });
    } catch (error) {
        console.error("BE Controller: Error fetching available rooms:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi lấy danh sách phòng trống",
            error: error.message || "Unknown error" 
        });
    }
};

export default {
    createRoom,        
    getAllRooms,        
    getRoom,           
    editRoom,           
    lockRoom,           
    listAvailableRooms  
};