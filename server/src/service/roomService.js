import connection from "../config/connectDB";
import QRCode from "qrcode";

// Helper function to determine status based on seats, respecting Maintenance
const calculateStatus = (availableSeats, currentStatus = null) => {
    if (currentStatus === 'Maintenance') {
        return 'Maintenance';
    }
    if (availableSeats === 0) {
        return 'Occupied';
    }
    return 'Available';
};

/**
 * Thêm một phòng mới vào cơ sở dữ liệu.
 * Tự động xác định trạng thái 'Available' hoặc 'Occupied' dựa trên available_seats,
 * trừ khi trạng thái 'Maintenance' được chỉ định rõ ràng.
 * @param {object} room - Thông tin phòng cần thêm.
 * @param {number} room.capacity - Sức chứa tối đa.
 * @param {string} room.location - Vị trí phòng.
 * @param {string} [room.room_status='Available'] - Trạng thái ban đầu ('Available', 'Occupied', 'Maintenance'). Sẽ bị ghi đè nếu không phải 'Maintenance'.
 * @param {string} room.room_type - Loại phòng ('single', 'group').
 * @param {number} [room.available_seats] - Số chỗ trống ban đầu (mặc định bằng capacity).
 * @param {string[]|string} [room.devices] - Danh sách thiết bị.
 * @returns {Promise<{message: string, roomId: number}>} - Promise chứa thông báo và ID phòng mới.
 */
const addRoom = async (room) => {
    const {
        capacity,
        location,
        room_status: initial_status_input,
        room_type,
        available_seats: initial_available_seats,
        devices = []
    } = room;

    if (!capacity || !location || !room_type) {
        throw new Error("Thiếu thông tin bắt buộc: capacity, location, room_type.");
    }
    if (initial_status_input && !['Available', 'Occupied', 'Maintenance'].includes(initial_status_input)) {
        throw new Error("Trạng thái phòng không hợp lệ.");
    }
    if (!['single', 'group'].includes(room_type)) {
        throw new Error("Loại phòng không hợp lệ. Chỉ chấp nhận 'single' hoặc 'group'.");
    }
    if (typeof capacity !== 'number' || capacity <= 0) {
         throw new Error("Sức chứa phải là một số dương.");
    }

    let final_available_seats = (initial_available_seats !== undefined && initial_available_seats !== null)
                                ? Number(initial_available_seats)
                                : capacity;

    if (isNaN(final_available_seats) || final_available_seats < 0 || final_available_seats > capacity) {
        throw new Error(`Số chỗ còn trống không hợp lệ (phải là số từ 0 đến ${capacity}).`);
    }

    let final_room_status;
    if (initial_status_input === 'Maintenance') {
        final_room_status = 'Maintenance';
    } else {
        final_room_status = calculateStatus(final_available_seats);
    }

    return new Promise((resolve, reject) => {
        const insertRoomQuery = `
            INSERT INTO Rooms (capacity, location, status, available_seats, room_type)
            VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(
            insertRoomQuery,
            [capacity, location, final_room_status, final_available_seats, room_type],
            async (err, result) => {
                if (err) {
                    console.error("SQL Error inserting room:", err);
                    return reject(new Error("Lỗi cơ sở dữ liệu khi thêm phòng: " + err.message));
                }
                if (!result || !result.insertId) {
                    return reject(new Error("Không thể thêm phòng vào cơ sở dữ liệu."));
                }

                const roomId = result.insertId;
                const qrText = `Room_${roomId}`;

                try {
                    const qrBase64 = await QRCode.toDataURL(qrText);
                    const updateQRQuery = `UPDATE Rooms SET qr_code = ? WHERE ID = ?`;

                    connection.query(updateQRQuery, [qrBase64, roomId], (qrErr) => {
                        if (qrErr) {
                            console.error("SQL Error updating QR Code:", qrErr);
                            // Consider if room should be deleted or marked invalid if QR fails
                            return reject(new Error("Lỗi cập nhật mã QR: " + qrErr.message));
                        }

                        let deviceArray = [];
                        if (Array.isArray(devices)) {
                            deviceArray = devices.filter(d => typeof d === 'string' && d.trim() !== '');
                        } else if (typeof devices === 'string' && devices.trim() !== '') {
                            deviceArray = devices.split(',').map(d => d.trim()).filter(d => d !== '');
                        }

                        if (deviceArray.length > 0) {
                            const insertDevicesQuery = `INSERT INTO Devices (device_name, room_id) VALUES ?`;
                            const deviceValues = deviceArray.map(device => [device, roomId]);

                            connection.query(insertDevicesQuery, [deviceValues], (devErr) => {
                                if (devErr) {
                                     console.error("SQL Error inserting devices:", devErr);
                                    // Consider potential rollback or cleanup if devices fail
                                    return reject(new Error("Lỗi thêm thiết bị: " + devErr.message));
                                }
                                resolve({ message: "Thêm phòng và thiết bị thành công", roomId: roomId });
                            });
                        } else {
                            resolve({ message: "Thêm phòng thành công (không có thiết bị)", roomId: roomId });
                        }
                    });
                } catch (qrGenErr) {
                     console.error("Error generating QR Code:", qrGenErr);
                     // Consider if room should be deleted or marked invalid if QR fails
                    return reject(new Error("Lỗi tạo mã QR: " + qrGenErr.message));
                }
            }
        );
    });
};


/**
 * Cập nhật thông tin một phòng hiện có.
 * Tự động điều chỉnh trạng thái ('Available'/'Occupied') dựa trên 'available_seats' sau khi cập nhật,
 * trừ khi trạng thái được đặt thành 'Maintenance'.
 * Cập nhật 'available_seats' nếu 'capacity' thay đổi và 'available_seats' vượt quá 'capacity' mới.
 * @param {number} roomId - ID của phòng cần cập nhật.
 * @param {object} updatedRoomData - Đối tượng chứa các trường cần cập nhật.
 * @returns {Promise<object|null>} - Promise chứa đối tượng phòng đã cập nhật hoặc null nếu không tìm thấy.
 */
const updateRoom = async (roomId, updatedRoomData) => {
     if (!roomId || isNaN(parseInt(roomId, 10))) {
         return Promise.reject(new Error("ID phòng không hợp lệ để cập nhật."));
     }
     if (!updatedRoomData || Object.keys(updatedRoomData).length === 0) {
          console.warn(`Không có dữ liệu cập nhật cho phòng ${roomId}. Trả về dữ liệu hiện tại.`);
         // Return current data if nothing to update
         return getRoomById(roomId);
     }

    try {
        const currentRoom = await getRoomById(roomId);
        if (!currentRoom) {
            return null; // Indicate room not found
        }

        const finalData = { ...currentRoom };

        if (updatedRoomData.location !== undefined) finalData.location = updatedRoomData.location.trim();
        if (updatedRoomData.room_type !== undefined) finalData.room_type = updatedRoomData.room_type;

        if (updatedRoomData.capacity !== undefined) {
            const newCapacity = Number(updatedRoomData.capacity);
            if (isNaN(newCapacity) || newCapacity <= 0) {
                throw new Error("Sức chứa cập nhật phải là một số dương.");
            }
            finalData.capacity = newCapacity;
        }

        if (updatedRoomData.available_seats !== undefined) {
            const requestedAvailableSeats = (updatedRoomData.available_seats !== null && updatedRoomData.available_seats !== '')
                                             ? Number(updatedRoomData.available_seats)
                                             : finalData.available_seats;

             if (isNaN(requestedAvailableSeats) || requestedAvailableSeats < 0) {
                throw new Error("Số chỗ còn trống cập nhật phải là số không âm.");
             }
             finalData.available_seats = requestedAvailableSeats;
        }

        finalData.available_seats = Math.min(finalData.available_seats, finalData.capacity);
        finalData.available_seats = Math.max(finalData.available_seats, 0);

        let finalStatus;
        const requestedStatus = updatedRoomData.status;

        if (requestedStatus === 'Maintenance') {
            finalStatus = 'Maintenance';
        } else if (currentRoom.status === 'Maintenance' && requestedStatus === undefined) {
            finalStatus = 'Maintenance';
        } else {
            finalStatus = calculateStatus(finalData.available_seats);
        }
        finalData.status = finalStatus;

        let fieldsToUpdate = [];
        let values = [];
        const potentialUpdates = {
            capacity: finalData.capacity,
            location: finalData.location,
            status: finalData.status,
            available_seats: finalData.available_seats,
            room_type: finalData.room_type
        };

        for (const key in potentialUpdates) {
            if (updatedRoomData.hasOwnProperty(key) || potentialUpdates[key] !== currentRoom[key]) {
                 if (key === 'status' && potentialUpdates[key] !== currentRoom.status) {
                    fieldsToUpdate.push("status = ?");
                    values.push(potentialUpdates[key]);
                 } else if (key === 'available_seats' && potentialUpdates[key] !== currentRoom.available_seats) {
                    fieldsToUpdate.push("available_seats = ?");
                    values.push(potentialUpdates[key]);
                 } else if (updatedRoomData.hasOwnProperty(key)) {
                    fieldsToUpdate.push(`${key} = ?`);
                    values.push(potentialUpdates[key]);
                 }
            }
        }

        if (fieldsToUpdate.length === 0) {
            console.warn(`Không có thay đổi nào cần áp dụng cho phòng ${roomId}.`);
            return currentRoom;
        }

        values.push(roomId);
        const query = `UPDATE Rooms SET ${fieldsToUpdate.join(', ')} WHERE ID = ?`;

        return new Promise((resolve, reject) => {
            connection.query(query, values, (err, result) => {
                if (err) {
                     console.error(`SQL Error updating room ${roomId}:`, err);
                     return reject(new Error("Lỗi cập nhật phòng: " + err.message));
                }

                if (result.affectedRows === 0 && result.changedRows === 0) {
                     console.warn(`Phòng ${roomId} không được tìm thấy hoặc không có thay đổi nào được áp dụng.`);
                     return getRoomById(roomId).then(resolve).catch(reject);
                }

                getRoomById(roomId)
                    .then(updatedRoom => {
                        if (!updatedRoom) {
                             console.error(`Không thể lấy lại thông tin phòng ${roomId} sau khi cập nhật.`);
                             reject(new Error(`Không thể lấy lại thông tin phòng ${roomId} sau khi cập nhật.`));
                        } else {
                            resolve(updatedRoom);
                        }
                    })
                    .catch(getErr => {
                         console.error(`Lỗi khi lấy lại thông tin phòng ${roomId} sau cập nhật:`, getErr);
                         reject(getErr);
                    });
            });
        });

    } catch (error) {
        console.error(`Lỗi trong quá trình updateRoom cho ID ${roomId}:`, error);
        return Promise.reject(error);
    }
};


/**
 * Khóa phòng (chuyển trạng thái sang 'Maintenance').
 * Sẽ đặt available_seats thành 0 khi khóa phòng.
 * @param {number} roomId - ID của phòng cần khóa.
 * @returns {Promise<boolean>} - Promise trả về true nếu thành công, false nếu không tìm thấy hoặc đã khóa.
 */
const lockRoom = (roomId) => {
     if (!roomId || isNaN(parseInt(roomId, 10))) {
         return Promise.reject(new Error("ID phòng không hợp lệ để khóa."));
     }
    return new Promise((resolve, reject) => {
        const query = `UPDATE Rooms SET status = 'Maintenance', available_seats = 0 WHERE ID = ? AND status != 'Maintenance'`;
        connection.query(query, [roomId], (err, result) => {
            if (err) {
                console.error(`SQL Error locking room ${roomId}:`, err);
                return reject(new Error("Lỗi khi cập nhật trạng thái phòng: " + err.message));
            }
            resolve(result.changedRows > 0);
        });
    });
};

/**
 * Lấy danh sách tất cả các phòng cùng thông tin cơ bản và thiết bị.
 * @returns {Promise<Array<object>>} - Promise chứa mảng các đối tượng phòng.
 */
const getRoomList = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                r.ID, r.capacity, r.location, r.status,
                r.available_seats, r.room_type, r.qr_code,
                GROUP_CONCAT(DISTINCT d.device_name SEPARATOR ', ') AS devices
            FROM Rooms r
            LEFT JOIN Devices d ON r.ID = d.room_id
            GROUP BY r.ID
            ORDER BY r.ID ASC
        `;
        connection.query(query, (err, results) => {
            if (err) {
                 console.error("SQL Error fetching room list:", err);
                 return reject(new Error("Lỗi truy vấn danh sách phòng: " + err.message));
            }
             const formattedResults = results.map(room => ({
                room_id: room.ID,
                capacity: room.capacity,
                location: room.location,
                room_status: room.status,
                available_seats: room.available_seats,
                room_type: room.room_type,
                qr_code: room.qr_code,
                devices: room.devices // devices is already a comma-separated string from GROUP_CONCAT
             }));
            resolve(formattedResults);
        });
    });
};

/**
 * Lấy thông tin chi tiết của một phòng theo ID, bao gồm cả thiết bị.
 * @param {number} roomId - ID của phòng cần lấy.
 * @returns {Promise<object|null>} - Promise chứa đối tượng phòng hoặc null nếu không tìm thấy.
 */
const getRoomById = (roomId) => {
    return new Promise((resolve, reject) => {
        if (!roomId || isNaN(parseInt(roomId, 10))) {
            return reject(new Error("ID phòng không hợp lệ."));
        }
        const roomQuery = `
            SELECT
                ID, capacity, location, status,
                available_seats, room_type, qr_code
            FROM Rooms
            WHERE ID = ?
        `;
        connection.query(roomQuery, [roomId], (err, roomResult) => {
            if (err) {
                 console.error(`SQL Error fetching room ${roomId}:`, err);
                 return reject(new Error("Lỗi truy vấn phòng: " + err.message));
            }

            if (roomResult.length === 0) {
                return resolve(null); // Room not found
            }

            const roomData = {
                 ID: roomResult[0].ID,
                 room_id: roomResult[0].ID,
                 capacity: roomResult[0].capacity,
                 location: roomResult[0].location,
                 status: roomResult[0].status,
                 room_status: roomResult[0].status,
                 available_seats: roomResult[0].available_seats,
                 room_type: roomResult[0].room_type,
                 qr_code: roomResult[0].qr_code,
                 // devices will be added below
            };

            const devicesQuery = `SELECT device_name FROM Devices WHERE room_id = ? ORDER BY device_name`;
            connection.query(devicesQuery, [roomId], (devErr, devicesResult) => {
                if (devErr) {
                     // Log warning but still return room data without devices
                     console.warn(`Không thể lấy danh sách thiết bị cho phòng ${roomId}: ${devErr.message}`);
                     roomData.devices = [];
                     return resolve(roomData);
                }
                // Map device results to an array of strings
                roomData.devices = devicesResult.map(d => d.device_name);
                resolve(roomData);
            });
        });
    });
};


/**
 * Lấy danh sách các phòng đang có trạng thái 'Available'.
 * @returns {Promise<Array<object>>} - Promise chứa mảng các phòng trống.
 */
const getAvailableRooms = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                r.ID, r.capacity, r.location, r.status,
                r.available_seats, r.room_type, r.qr_code,
                GROUP_CONCAT(DISTINCT d.device_name SEPARATOR ', ') AS devices
            FROM Rooms r
            LEFT JOIN Devices d ON r.ID = d.room_id
            WHERE r.status = 'Available'
            GROUP BY r.ID
            ORDER BY r.ID ASC
        `;
        connection.query(query, (err, results) => {
            if (err) {
                console.error("SQL Error fetching available rooms:", err);
                return reject(new Error("Lỗi truy vấn danh sách phòng trống: " + err.message));
            }
            const formattedResults = results.map(room => ({
                room_id: room.ID,
                capacity: room.capacity,
                location: room.location,
                room_status: room.status,
                available_seats: room.available_seats,
                room_type: room.room_type,
                qr_code: room.qr_code,
                devices: room.devices // Already a comma-separated string
             }));
            resolve(formattedResults);
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