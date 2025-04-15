import connection from "../config/connectDB";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

// Hàm thêm phòng mới, tạo mã QR và thêm thiết bị vào bảng Devices
const addRoom = async (room) => {
    const { capacity, location, status, devices = [] } = room;

    return new Promise(async (resolve, reject) => {
        // Bước 1: Thêm phòng vào cơ sở dữ liệu
        const insertRoomQuery = `INSERT INTO Rooms (capacity, location, status) VALUES (?, ?, ?)`;

        connection.query(insertRoomQuery, [capacity, location, status], async (err, result) => {
            if (err) return reject("Lỗi thêm phòng: " + err.message);

            const roomId = result.insertId; // Lấy ID của phòng mới thêm
            const qrText = `Room_${roomId}`; // Nội dung QR sẽ là ID phòng
            const qrFileName = `room_${roomId}.png`; // Tên tệp mã QR
            const qrPath = path.join("public/uploads/qr", qrFileName); // Đường dẫn lưu mã QR

            // Bước 2: Tạo mã QR và lưu vào thư mục
            try {
                await QRCode.toFile(qrPath, qrText); // Tạo mã QR và lưu vào tệp
            } catch (err) {
                return reject("Lỗi tạo mã QR: " + err.message);
            }

            // Bước 3: Cập nhật tên tệp QR vào bảng Rooms
            const updateQRQuery = `UPDATE Rooms SET qr_code = ? WHERE ID = ?`;
            connection.query(updateQRQuery, [qrFileName, roomId], (err) => {
                if (err) return reject("Lỗi cập nhật mã QR: " + err.message);

                // Bước 4: Thêm thiết bị vào bảng Devices nếu có
                if (devices.length > 0) {
                    const insertDevicesQuery = `INSERT INTO Devices (device_name, room_id) VALUES ?`;
                    const values = devices.map(device => [device, roomId]); // Tạo mảng dữ liệu thiết bị

                    connection.query(insertDevicesQuery, [values], (err) => {
                        if (err) return reject("Lỗi thêm thiết bị: " + err.message);
                        resolve("Thêm phòng và thiết bị thành công");
                    });
                } else {
                    resolve("Thêm phòng thành công nhưng không có thiết bị");
                }
            });
        });
    });
};

// Hàm lấy danh sách phòng
const getRoomList = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                r.ID AS room_id,
                r.capacity,
                r.location,
                r.status AS room_status,
                r.qr_code,
                GROUP_CONCAT(d.device_name SEPARATOR ', ') AS devices
            FROM Rooms r
            LEFT JOIN Devices d ON r.ID = d.room_id
            GROUP BY r.ID
        `;
        connection.query(query, (err, results) => {
            if (err) {
                console.error("Lỗi truy vấn danh sách phòng:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Hàm lấy thông tin phòng theo ID
const getRoomById = (roomId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Rooms WHERE ID = ?`;
        connection.query(query, [roomId], (err, result) => {
            if (err) return reject("Lỗi truy vấn phòng: " + err.message);
            resolve(result[0]); // Trả về phòng đầu tiên
        });
    });
};

// Hàm sửa thông tin phòng
const updateRoom = (roomId, updatedRoom) => {
    const { capacity, location, status } = updatedRoom;

    return new Promise((resolve, reject) => {
        const query = `UPDATE Rooms SET capacity = ?, location = ?, status = ? WHERE ID = ?`;
        connection.query(query, [capacity, location, status, roomId], (err) => {
            if (err) return reject("Lỗi cập nhật phòng: " + err.message);
            resolve("Cập nhật phòng thành công");
        });
    });
};

// Hàm xóa phòng
const deleteRoom = (roomId) => {
    return new Promise((resolve, reject) => {
        const deleteDevicesQuery = `DELETE FROM Devices WHERE room_id = ?`;
        connection.query(deleteDevicesQuery, [roomId], (err) => {
            if (err) return reject("Lỗi xóa thiết bị: " + err.message);

            const deleteRoomQuery = `DELETE FROM Rooms WHERE ID = ?`;
            connection.query(deleteRoomQuery, [roomId], (err) => {
                if (err) return reject("Lỗi xóa phòng: " + err.message);
                resolve("Xóa phòng thành công");
            });
        });
    });
};

export default {
    addRoom,
    getRoomList,
    getRoomById,
    updateRoom,
    deleteRoom
};
