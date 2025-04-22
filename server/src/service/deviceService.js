import connection from "../config/connectDB";

const getDevices = async () => {
    try {
        const sql = `
            SELECT 
                d.device_name, 
                r.id AS room_id
            FROM Devices d 
            JOIN Rooms r ON d.room_id = r.id
        `;
        
        const [devices] = await connection.promise().query(sql);
        return devices;

    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch devices");
    }
};
const getDevicesByRoomId = (roomId) => {
    return new Promise((resolve, reject) => {
        const roomIdInt = parseInt(roomId, 10);
        if (isNaN(roomIdInt)) {
            return reject(new Error("Room ID không hợp lệ để lấy thiết bị."));
        }

        const sql = `SELECT id, device_name, status FROM Devices WHERE room_id = ?`;
        connection.query(sql, [roomIdInt], (err, results) => {
            if (err) {
                console.error(`Error fetching devices for room ${roomIdInt}:`, err);
                return reject(new Error("Lỗi truy vấn danh sách thiết bị phòng."));
            }
            resolve(results); 
        });
    });
};

export default {
    getDevices,
    getDevicesByRoomId
};