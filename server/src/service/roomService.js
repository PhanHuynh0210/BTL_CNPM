import connection from "../config/connectDB";
import QRCode from "qrcode";


// Helper function to determine status based on seats, respecting Maintenance
const calculateStatus = (availableSeats, currentStatus = null) => {
    // If the current status is Maintenance, it should generally stay Maintenance
    // unless explicitly changed by other logic (like in updateRoom).
    // This helper focuses purely on seats vs status logic.
    if (currentStatus === 'Maintenance') {
        return 'Maintenance';
    }
    // If seats are 0, it's Occupied
    if (availableSeats === 0) {
        return 'Occupied';
    }
    // Otherwise (seats > 0), it's Available
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
        room_status: initial_status_input, // Lấy status người dùng nhập (có thể undefined)
        room_type,
        available_seats: initial_available_seats, // Lấy available_seats người dùng nhập (có thể undefined)
        devices = []
    } = room;

    // --- Validation ---
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

    // Determine final available_seats
    let final_available_seats = (initial_available_seats !== undefined && initial_available_seats !== null)
                                ? Number(initial_available_seats) // Convert to number if provided
                                : capacity; // Default to capacity if not provided

    // Validate final_available_seats
    if (isNaN(final_available_seats) || final_available_seats < 0 || final_available_seats > capacity) {
        throw new Error(`Số chỗ còn trống không hợp lệ (phải là số từ 0 đến ${capacity}).`);
    }

    // Determine final room_status
    let final_room_status;
    if (initial_status_input === 'Maintenance') {
        final_room_status = 'Maintenance'; // Respect explicit Maintenance status
    } else {
        // Calculate status based on final available seats
        final_room_status = calculateStatus(final_available_seats);
    }
    // --- Kết thúc Validation & Determination ---

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
                            return reject(new Error("Lỗi cập nhật mã QR: " + qrErr.message));
                        }

                        // Process devices
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
         // Use reject for async function returning promise
         return Promise.reject(new Error("ID phòng không hợp lệ để cập nhật."));
     }
     if (!updatedRoomData || Object.keys(updatedRoomData).length === 0) {
          console.warn(`Không có dữ liệu cập nhật cho phòng ${roomId}. Trả về dữ liệu hiện tại.`);
         return getRoomById(roomId);
     }

    try {
        // 1. Lấy thông tin phòng hiện tại
        const currentRoom = await getRoomById(roomId);
        if (!currentRoom) {
            return null; // Phòng không tồn tại
        }

        // 2. Xác định giá trị cuối cùng cho các trường có thể thay đổi
        const finalData = { ...currentRoom }; // Bắt đầu với dữ liệu hiện tại

        // Fields that can be directly updated if provided
        if (updatedRoomData.location !== undefined) finalData.location = updatedRoomData.location.trim();
        if (updatedRoomData.room_type !== undefined) finalData.room_type = updatedRoomData.room_type;

        // Handle capacity update
        if (updatedRoomData.capacity !== undefined) {
            const newCapacity = Number(updatedRoomData.capacity);
            if (isNaN(newCapacity) || newCapacity <= 0) {
                throw new Error("Sức chứa cập nhật phải là một số dương.");
            }
            finalData.capacity = newCapacity;
        }

        // Handle available_seats update (and adjust based on new capacity)
        if (updatedRoomData.available_seats !== undefined) {
             // Use provided value, default to current if undefined
            const requestedAvailableSeats = (updatedRoomData.available_seats !== null && updatedRoomData.available_seats !== '')
                                             ? Number(updatedRoomData.available_seats)
                                             : finalData.available_seats; // Use potentially updated current value if input is empty string/null

             if (isNaN(requestedAvailableSeats) || requestedAvailableSeats < 0) {
                throw new Error("Số chỗ còn trống cập nhật phải là số không âm.");
             }
             finalData.available_seats = requestedAvailableSeats;
        }

        // Ensure available_seats does not exceed final capacity
        finalData.available_seats = Math.min(finalData.available_seats, finalData.capacity);
        finalData.available_seats = Math.max(finalData.available_seats, 0); // Ensure non-negative


        // Handle status update: Respect Maintenance, otherwise calculate based on final seats
        let finalStatus;
        const requestedStatus = updatedRoomData.status; // Status user wants to set

        if (requestedStatus === 'Maintenance') {
            finalStatus = 'Maintenance';
        } else if (currentRoom.status === 'Maintenance' && requestedStatus === undefined) {
            // If it was Maintenance and user didn't try to change status, keep it Maintenance
            finalStatus = 'Maintenance';
        } else {
            // Otherwise, calculate based on the final available seats
            finalStatus = calculateStatus(finalData.available_seats);
        }
        finalData.status = finalStatus; // Update status in finalData

        // 3. Xây dựng câu lệnh UPDATE động (chỉ update các trường thực sự thay đổi)
        let fieldsToUpdate = [];
        let values = [];
        const potentialUpdates = {
            capacity: finalData.capacity,
            location: finalData.location,
            status: finalData.status,
            available_seats: finalData.available_seats,
            room_type: finalData.room_type
        };

        // Compare final calculated values with original currentRoom values
        for (const key in potentialUpdates) {
            // Check if the key exists in updatedRoomData OR if calculated value differs from original
            // (e.g., available_seats adjusted due to capacity change, or status recalculated)
            if (updatedRoomData.hasOwnProperty(key) || potentialUpdates[key] !== currentRoom[key]) {
                 // More robust check for status/available_seats which might change implicitly
                 if (key === 'status' && potentialUpdates[key] !== currentRoom.status) {
                    fieldsToUpdate.push("status = ?");
                    values.push(potentialUpdates[key]);
                 } else if (key === 'available_seats' && potentialUpdates[key] !== currentRoom.available_seats) {
                    fieldsToUpdate.push("available_seats = ?");
                    values.push(potentialUpdates[key]);
                 } else if (updatedRoomData.hasOwnProperty(key)) { // For other fields, only update if explicitly provided
                    fieldsToUpdate.push(`${key} = ?`);
                    values.push(potentialUpdates[key]);
                 }
            }
        }


        // Nếu không có trường nào hợp lệ để cập nhật (kể cả tính toán lại)
        if (fieldsToUpdate.length === 0) {
            console.warn(`Không có thay đổi nào cần áp dụng cho phòng ${roomId}.`);
            return currentRoom; // Trả về dữ liệu phòng hiện tại
        }

        values.push(roomId); // Thêm roomId vào cuối cho điều kiện WHERE
        const query = `UPDATE Rooms SET ${fieldsToUpdate.join(', ')} WHERE ID = ?`;

        // 4. Thực thi query
        return new Promise((resolve, reject) => {
            connection.query(query, values, (err, result) => {
                if (err) {
                     console.error(`SQL Error updating room ${roomId}:`, err);
                     return reject(new Error("Lỗi cập nhật phòng: " + err.message));
                }

                if (result.affectedRows === 0 && result.changedRows === 0) {
                     // Should not happen if we checked existence before, but maybe a race condition?
                     // Or data was identical even after calculations.
                     console.warn(`Phòng ${roomId} không được tìm thấy hoặc không có thay đổi nào được áp dụng.`);
                     // Re-fetch to be sure of the current state
                     return getRoomById(roomId).then(resolve).catch(reject);
                }

                // 5. Lấy lại thông tin phòng *sau khi* đã cập nhật thành công
                getRoomById(roomId)
                    .then(updatedRoom => {
                        if (!updatedRoom) {
                             console.error(`Không thể lấy lại thông tin phòng ${roomId} sau khi cập nhật.`);
                             reject(new Error(`Không thể lấy lại thông tin phòng ${roomId} sau khi cập nhật.`));
                        } else {
                            resolve(updatedRoom); // Resolve with the fresh data
                        }
                    })
                    .catch(getErr => {
                         console.error(`Lỗi khi lấy lại thông tin phòng ${roomId} sau cập nhật:`, getErr);
                         reject(getErr); // Lỗi khi get lại phòng sau update
                    });
            });
        });

    } catch (error) {
        console.error(`Lỗi trong quá trình updateRoom cho ID ${roomId}:`, error);
        // Propagate the error as a rejection
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
        // Update status to Maintenance and set available_seats to 0
        // Only update if it's not already Maintenance
        const query = `UPDATE Rooms SET status = 'Maintenance', available_seats = 0 WHERE ID = ? AND status != 'Maintenance'`;
        connection.query(query, [roomId], (err, result) => {
            if (err) {
                console.error(`SQL Error locking room ${roomId}:`, err);
                return reject(new Error("Lỗi khi cập nhật trạng thái phòng: " + err.message));
            }
            // result.changedRows indicates if the status was actually changed
            resolve(result.changedRows > 0);
        });
    });
};

// ============================================================
// Các hàm khác (getRoomList, getRoomById, getAvailableRooms)
// không cần thay đổi logic cốt lõi, chúng chỉ đọc dữ liệu.
// Đảm bảo chúng lấy đúng các cột cần thiết (đã có sẵn).
// ============================================================

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
             // Map results to match expected frontend property names if needed (e.g., room_id, room_status)
             const formattedResults = results.map(room => ({
                room_id: room.ID,
                capacity: room.capacity,
                location: room.location,
                room_status: room.status, // Map db 'status' to 'room_status'
                available_seats: room.available_seats,
                room_type: room.room_type,
                qr_code: room.qr_code,
                devices: room.devices
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
                return resolve(null);
            }

            const roomData = { // Map to consistent naming if necessary
                 ID: roomResult[0].ID, // Keep original ID for internal use maybe
                 room_id: roomResult[0].ID, // For consistency with list view
                 capacity: roomResult[0].capacity,
                 location: roomResult[0].location,
                 status: roomResult[0].status, // DB column name
                 room_status: roomResult[0].status, // Alias for frontend/consistency
                 available_seats: roomResult[0].available_seats,
                 room_type: roomResult[0].room_type,
                 qr_code: roomResult[0].qr_code,
            };


            const devicesQuery = `SELECT device_name FROM Devices WHERE room_id = ? ORDER BY device_name`;
            connection.query(devicesQuery, [roomId], (devErr, devicesResult) => {
                if (devErr) {
                     console.warn(`Không thể lấy danh sách thiết bị cho phòng ${roomId}: ${devErr.message}`);
                     roomData.devices = []; // Return empty array on error
                     return resolve(roomData);
                }
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
             // Map results for consistency
            const formattedResults = results.map(room => ({
                room_id: room.ID,
                capacity: room.capacity,
                location: room.location,
                room_status: room.status,
                available_seats: room.available_seats,
                room_type: room.room_type,
                qr_code: room.qr_code,
                devices: room.devices
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