import connection from "../config/connectDB";
import QRCode from "qrcode";
import path from "path";

const addRoom = async (room) => {
    const { capacity, location, room_status, devices = [] } = room;

    return new Promise((resolve, reject) => {
        const insertRoomQuery = `INSERT INTO Rooms (capacity, location, status) VALUES (?, ?, ?)`;

        connection.query(insertRoomQuery, [capacity, location, room_status], async (err, result) => {
            if (err) return reject("Lỗi thêm phòng: " + err.message);

            const roomId = result.insertId;
            const qrText = `Room_${roomId}`;

            try {
                // Tạo mã QR dưới dạng base64
                const qrBase64 = await QRCode.toDataURL(qrText);
                
                // Cập nhật mã QR vào cơ sở dữ liệu
                const updateQRQuery = `UPDATE Rooms SET qr_code = ? WHERE ID = ?`;
                connection.query(updateQRQuery, [qrBase64, roomId], (err) => {
                    if (err) return reject("Lỗi cập nhật mã QR: " + err.message);

                    // Nếu 'devices' là chuỗi, chuyển thành mảng
                    let deviceArray = Array.isArray(devices) ? devices : devices.split(',').map(device => device.trim());

                    // Thêm thiết bị vào cơ sở dữ liệu
                    if (deviceArray.length > 0) {
                        const insertDevicesQuery = `INSERT INTO Devices (device_name, room_id) VALUES ?`;
                        const values = deviceArray.map(device => [device, roomId]);

                        connection.query(insertDevicesQuery, [values], (err) => {
                            if (err) return reject("Lỗi thêm thiết bị: " + err.message);
                            resolve("Thêm phòng và thiết bị thành công");
                        });
                    } else {
                        resolve("Thêm phòng thành công");
                    }
                });
            } catch (err) {
                return reject("Lỗi tạo mã QR: " + err.message);
            }
        });
    });
};

const getRoomList = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                r.ID AS room_id, r.capacity, r.location, r.status AS room_status, r.qr_code,
                GROUP_CONCAT(d.device_name SEPARATOR ', ') AS devices
            FROM Rooms r
            LEFT JOIN Devices d ON r.ID = d.room_id
            GROUP BY r.ID
        `;
        connection.query(query, (err, results) => {
            if (err) return reject("Lỗi truy vấn danh sách phòng: " + err.message);
            resolve(results);
        });
    });
};

const getRoomById = (roomId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Rooms WHERE ID = ?`;
        connection.query(query, [roomId], (err, result) => {
            if (err) return reject("Lỗi truy vấn phòng: " + err.message);
            resolve(result[0]);
        });
    });
};

const updateRoom = async (roomId, updatedRoom) => {
    const { capacity, location, status } = updatedRoom;

    // Kiểm tra và đảm bảo giá trị status hợp lệ
    if (!['Available', 'Occupied', 'Maintenance'].includes(status)) {
        throw new Error("Trạng thái phòng không hợp lệ");
    }

    return new Promise((resolve, reject) => {
        const query = `UPDATE Rooms SET capacity = ?, location = ?, status = ? WHERE ID = ?`;
        connection.query(query, [capacity, location, status, roomId], (err, result) => {
            if (err) return reject("Lỗi cập nhật phòng: " + err.message);
            if (result.affectedRows === 0) return resolve(null); // Không có gì thay đổi
            const selectQuery = `SELECT * FROM Rooms WHERE ID = ?`;
            connection.query(selectQuery, [roomId], (err, rows) => {
                if (err) return reject("Lỗi truy vấn phòng sau cập nhật: " + err.message);
                resolve(rows[0]);
            });
        });
    });
};

const lockRoom = (roomId) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE Rooms SET status = 'Maintenance' WHERE ID = ?`;
        connection.query(query, [roomId], (err, result) => {
            if (err) return reject("Lỗi khi cập nhật trạng thái phòng: " + err.message);
            if (result.affectedRows === 0) return resolve(false);
            resolve(true);
        });
    });
};

const getAvailableRooms = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                r.ID AS room_id, r.capacity, r.location, r.status AS room_status, r.qr_code,
                GROUP_CONCAT(d.device_name SEPARATOR ', ') AS devices
            FROM Rooms r
            LEFT JOIN Devices d ON r.ID = d.room_id
            WHERE r.status = 'Available' -- Chỉ lấy phòng có trạng thái 'Available'
            GROUP BY r.ID
        `;
        connection.query(query, (err, results) => {
            if (err) return reject("Lỗi truy vấn danh sách phòng trống: " + err.message);
            resolve(results); // Trả về danh sách phòng trống
        });
    });
};

export default {
    addRoom,
    getRoomList,
    getRoomById,
    updateRoom,
    lockRoom,
    getAvailableRooms
};
