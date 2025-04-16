import connection from "../config/connectDB";
import QRCode from "qrcode";
// import path from "path"; // không được sử dụng

/**
 * Thêm một phòng mới vào cơ sở dữ liệu.
 * @param {object} room - Thông tin phòng cần thêm.
 * @param {number} room.capacity - Sức chứa tối đa.
 * @param {string} room.location - Vị trí phòng.
 * @param {string} room.room_status - Trạng thái ban đầu ('Available', 'Occupied', 'Maintenance').
 * @param {string} room.room_type - Loại phòng ('single', 'group').
 * @param {number} [room.available_seats] - Số chỗ trống ban đầu (mặc định bằng capacity).
 * @param {string[]|string} [room.devices] - Danh sách thiết bị (mảng hoặc chuỗi phân cách bởi dấu phẩy).
 * @returns {Promise<{message: string, roomId: number}>} - Promise chứa thông báo và ID phòng mới.
 */
const addRoom = async (room) => {
    // Lấy các trường từ input, bao gồm cả các trường mới
    const {
        capacity,
        location,
        room_status = 'Available', // Trạng thái mặc định nếu không cung cấp
        room_type,
        // Nếu available_seats không được cung cấp, mặc định là capacity
        available_seats = capacity,
        devices = [] // Mặc định là mảng rỗng
    } = room;

    // --- Validation ---
    if (!capacity || !location || !room_type) {
        throw new Error("Thiếu thông tin bắt buộc: capacity, location, room_type.");
    }
    if (!['Available', 'Occupied', 'Maintenance'].includes(room_status)) {
        throw new Error("Trạng thái phòng không hợp lệ.");
    }
    if (!['single', 'group'].includes(room_type)) {
        throw new Error("Loại phòng không hợp lệ. Chỉ chấp nhận 'single' hoặc 'group'.");
    }
    if (typeof capacity !== 'number' || capacity <= 0) {
         throw new Error("Sức chứa phải là một số dương.");
    }
    // Kiểm tra available_seats hợp lệ (phải là số, không âm, không lớn hơn capacity)
    if (typeof available_seats !== 'number' || available_seats < 0 || available_seats > capacity) {
        throw new Error(`Số chỗ còn trống không hợp lệ (phải là số từ 0 đến ${capacity}).`);
    }
    // --- Kết thúc Validation ---

    return new Promise((resolve, reject) => {
        // Cập nhật Query để bao gồm các cột mới
        const insertRoomQuery = `
            INSERT INTO Rooms (capacity, location, status, available_seats, room_type)
            VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(
            insertRoomQuery,
            // Truyền giá trị cho các cột mới
            [capacity, location, room_status, available_seats, room_type],
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
                    // Tạo và cập nhật QR code
                    const qrBase64 = await QRCode.toDataURL(qrText);
                    const updateQRQuery = `UPDATE Rooms SET qr_code = ? WHERE ID = ?`;

                    connection.query(updateQRQuery, [qrBase64, roomId], (qrErr) => {
                        if (qrErr) {
                            console.error("SQL Error updating QR Code:", qrErr);
                            // Cân nhắc: có nên rollback việc thêm phòng không? Hiện tại chỉ báo lỗi QR.
                            return reject(new Error("Lỗi cập nhật mã QR: " + qrErr.message));
                        }

                        // Xử lý devices (như cũ nhưng an toàn hơn)
                        let deviceArray = [];
                        if (Array.isArray(devices)) {
                            deviceArray = devices.filter(d => typeof d === 'string' && d.trim() !== '');
                        } else if (typeof devices === 'string' && devices.trim() !== '') {
                            deviceArray = devices.split(',').map(d => d.trim()).filter(d => d !== '');
                        }

                        if (deviceArray.length > 0) {
                            const insertDevicesQuery = `INSERT INTO Devices (device_name, room_id) VALUES ?`;
                            // Tạo mảng các mảng con [[deviceName1, roomId], [deviceName2, roomId]]
                            const deviceValues = deviceArray.map(device => [device, roomId]);

                            connection.query(insertDevicesQuery, [deviceValues], (devErr) => {
                                if (devErr) {
                                     console.error("SQL Error inserting devices:", devErr);
                                     // Cân nhắc rollback hoặc chỉ báo lỗi
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
 * Lấy danh sách tất cả các phòng cùng thông tin cơ bản và thiết bị.
 * @returns {Promise<Array<object>>} - Promise chứa mảng các đối tượng phòng.
 */
const getRoomList = () => {
    return new Promise((resolve, reject) => {
        // Cập nhật Query để lấy các trường mới
        const query = `
            SELECT
                r.ID AS room_id, r.capacity, r.location, r.status AS room_status,
                r.available_seats, r.room_type, -- <--- Lấy thêm cột mới
                r.qr_code,
                GROUP_CONCAT(DISTINCT d.device_name SEPARATOR ', ') AS devices -- Dùng DISTINCT để tránh lặp thiết bị
            FROM Rooms r
            LEFT JOIN Devices d ON r.ID = d.room_id
            GROUP BY r.ID -- Nhóm theo ID phòng là đủ
            ORDER BY r.ID ASC
        `;
        connection.query(query, (err, results) => {
            if (err) {
                 console.error("SQL Error fetching room list:", err);
                 return reject(new Error("Lỗi truy vấn danh sách phòng: " + err.message));
            }
            resolve(results);
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
        // Lấy thông tin phòng cơ bản
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
                return resolve(null); // Không tìm thấy phòng
            }

            const roomData = roomResult[0];

            // Lấy danh sách thiết bị cho phòng này
            const devicesQuery = `SELECT device_name FROM Devices WHERE room_id = ? ORDER BY device_name`;
            connection.query(devicesQuery, [roomId], (devErr, devicesResult) => {
                if (devErr) {
                     console.error(`SQL Error fetching devices for room ${roomId}:`, devErr);
                     // Trả về thông tin phòng nhưng báo lỗi không lấy được devices? Hoặc reject luôn?
                     // Tạm thời trả về phòng và mảng devices rỗng/null với cảnh báo
                     console.warn(`Không thể lấy danh sách thiết bị cho phòng ${roomId}: ${devErr.message}`);
                     roomData.devices = []; // Hoặc null
                     return resolve(roomData);
                     // Hoặc: return reject(new Error("Lỗi truy vấn thiết bị: " + devErr.message));
                }

                // Gắn danh sách tên thiết bị vào đối tượng phòng
                roomData.devices = devicesResult.map(d => d.device_name);
                resolve(roomData);
            });
        });
    });
};

/**
 * Cập nhật thông tin một phòng hiện có.
 * Chỉ cập nhật các trường được cung cấp trong `updatedRoomData`.
 * **Lưu ý:** Hàm này không xử lý cập nhật danh sách thiết bị.
 * @param {number} roomId - ID của phòng cần cập nhật.
 * @param {object} updatedRoomData - Đối tượng chứa các trường cần cập nhật.
 * @returns {Promise<object|null>} - Promise chứa đối tượng phòng đã cập nhật hoặc null nếu không tìm thấy.
 */
const updateRoom = async (roomId, updatedRoomData) => {
     if (!roomId || isNaN(parseInt(roomId, 10))) {
            return reject(new Error("ID phòng không hợp lệ để cập nhật."));
     }
      if (!updatedRoomData || Object.keys(updatedRoomData).length === 0) {
            // Nếu không có dữ liệu cập nhật, trả về thông tin phòng hiện tại
             console.warn(`Không có dữ liệu cập nhật cho phòng ${roomId}.`);
            return getRoomById(roomId); // Trả về Promise chứa phòng hiện tại
      }


    // Lấy các trường có thể cập nhật từ input
    const { capacity, location, status, available_seats, room_type } = updatedRoomData;

    // --- Validation cho các trường được cung cấp ---
    if (status !== undefined && !['Available', 'Occupied', 'Maintenance'].includes(status)) {
        throw new Error("Trạng thái phòng không hợp lệ.");
    }
    if (room_type !== undefined && !['single', 'group'].includes(room_type)) {
        throw new Error("Loại phòng không hợp lệ.");
    }
    if (capacity !== undefined && (typeof capacity !== 'number' || capacity <= 0)) {
         throw new Error("Sức chứa phải là một số dương.");
    }
    // Validation available_seats phức tạp hơn vì nó phụ thuộc vào capacity (có thể cũng đang được cập nhật)
    // Tạm thời kiểm tra đơn giản, có thể cần logic phức tạp hơn nếu capacity thay đổi
    const finalCapacity = capacity !== undefined ? capacity : (await getRoomById(roomId))?.capacity; // Lấy capacity mới hoặc cũ
    if (finalCapacity === undefined) throw new Error("Không thể xác định sức chứa để kiểm tra số chỗ trống."); // Lỗi nếu phòng không tồn tại

    if (available_seats !== undefined && (typeof available_seats !== 'number' || available_seats < 0 || available_seats > finalCapacity)) {
         throw new Error(`Số chỗ còn trống không hợp lệ (phải là số từ 0 đến ${finalCapacity}).`);
    }
    // --- Kết thúc Validation ---


    return new Promise((resolve, reject) => {
        // Xây dựng câu lệnh UPDATE động
        let fieldsToUpdate = [];
        let values = [];

        // Chỉ thêm vào SET nếu trường đó được cung cấp (khác undefined)
        if (capacity !== undefined) { fieldsToUpdate.push("capacity = ?"); values.push(capacity); }
        if (location !== undefined) { fieldsToUpdate.push("location = ?"); values.push(location.trim()); } // Trim location
        if (status !== undefined) { fieldsToUpdate.push("status = ?"); values.push(status); }
        if (available_seats !== undefined) { fieldsToUpdate.push("available_seats = ?"); values.push(available_seats); }
        if (room_type !== undefined) { fieldsToUpdate.push("room_type = ?"); values.push(room_type); }

        // Nếu không có trường nào hợp lệ để cập nhật
        if (fieldsToUpdate.length === 0) {
            console.warn(`Không có trường hợp lệ nào để cập nhật cho phòng ${roomId}.`);
            // Trả về dữ liệu phòng hiện tại mà không cần query UPDATE
            return getRoomById(roomId).then(resolve).catch(reject);
        }

        values.push(roomId); // Thêm roomId vào cuối cho điều kiện WHERE

        const query = `UPDATE Rooms SET ${fieldsToUpdate.join(', ')} WHERE ID = ?`;

        connection.query(query, values, (err, result) => {
            if (err) {
                 console.error(`SQL Error updating room ${roomId}:`, err);
                 return reject(new Error("Lỗi cập nhật phòng: " + err.message));
            }

            if (result.affectedRows === 0) {
                 // Kiểm tra xem phòng có tồn tại không
                 return getRoomById(roomId).then(existingRoom => {
                      if (!existingRoom) {
                           // Phòng không tồn tại
                           resolve(null); // Hoặc reject(new Error("Không tìm thấy phòng để cập nhật."))
                      } else {
                           // Phòng tồn tại nhưng không có gì thay đổi (dữ liệu giống hệt)
                            console.log(`Không có thay đổi nào được áp dụng cho phòng ${roomId}.`);
                           resolve(existingRoom);
                      }
                 }).catch(reject); // Lỗi khi kiểm tra phòng tồn tại
            }

            // Lấy lại thông tin phòng *sau khi* đã cập nhật thành công để trả về
            getRoomById(roomId)
                .then(updatedRoom => {
                    if (!updatedRoom) {
                        // Trường hợp hiếm gặp: update thành công nhưng get lại bị lỗi/không thấy
                         console.error(`Không thể lấy lại thông tin phòng ${roomId} sau khi cập nhật.`);
                         reject(new Error(`Không thể lấy lại thông tin phòng ${roomId} sau khi cập nhật.`));
                    } else {
                        resolve(updatedRoom);
                    }
                })
                .catch(reject); // Lỗi khi get lại phòng sau update
        });
    });
};


/**
 * Khóa phòng (chuyển trạng thái sang 'Maintenance').
 * @param {number} roomId - ID của phòng cần khóa.
 * @returns {Promise<boolean>} - Promise trả về true nếu thành công, false nếu không tìm thấy phòng.
 */
const lockRoom = (roomId) => {
     if (!roomId || isNaN(parseInt(roomId, 10))) {
            return Promise.reject(new Error("ID phòng không hợp lệ để khóa.")); // Dùng Promise.reject
     }
    return new Promise((resolve, reject) => {
        const query = `UPDATE Rooms SET status = 'Maintenance' WHERE ID = ? AND status != 'Maintenance'`; // Chỉ update nếu chưa phải Maintenance
        connection.query(query, [roomId], (err, result) => {
            if (err) {
                console.error(`SQL Error locking room ${roomId}:`, err);
                return reject(new Error("Lỗi khi cập nhật trạng thái phòng: " + err.message));
            }
            // result.affectedRows sẽ là 0 nếu không tìm thấy phòng HOẶC phòng đã là 'Maintenance'
            // result.changedRows sẽ là 1 nếu trạng thái thực sự được thay đổi
             resolve(result.changedRows > 0); // Trả về true nếu trạng thái đã thay đổi
        });
    });
};

/**
 * Lấy danh sách các phòng đang có trạng thái 'Available'.
 * @returns {Promise<Array<object>>} - Promise chứa mảng các phòng trống.
 */
const getAvailableRooms = () => {
    return new Promise((resolve, reject) => {
        // Cập nhật Query để lấy các trường mới
        const query = `
            SELECT
                r.ID AS room_id, r.capacity, r.location, r.status AS room_status,
                r.available_seats, r.room_type, -- <--- Lấy thêm cột mới
                r.qr_code,
                GROUP_CONCAT(DISTINCT d.device_name SEPARATOR ', ') AS devices
            FROM Rooms r
            LEFT JOIN Devices d ON r.ID = d.room_id
            WHERE r.status = 'Available' -- Điều kiện lọc giữ nguyên
            GROUP BY r.ID
            ORDER BY r.ID ASC
        `;
        connection.query(query, (err, results) => {
            if (err) {
                console.error("SQL Error fetching available rooms:", err);
                return reject(new Error("Lỗi truy vấn danh sách phòng trống: " + err.message));
            }
            resolve(results);
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