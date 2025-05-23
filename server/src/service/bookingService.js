// src/service/bookingService.js
import connection from "../config/connectDB";
import { format } from 'date-fns';
import deviceService from '../service/deviceService'


// --- Updated Constants ---
const DEFAULT_BOOKING_DURATION_MINUTES = 60; // Default for single or if not specified otherwise
const DEFAULT_DURATION_QUICK_BOOK_MINUTES = 120; // Default duration for quick booking GROUP rooms (2 hours)
const DEFAULT_GROUP_ATTENDEES = 6; // Default attendees for quick booking GROUP rooms
const DEFAULT_SINGLE_ATTENDEES = 1; // Default attendees for quick booking 

/**
 * Lấy danh sách tất cả các đặt phòng kèm thông tin phòng.
 */
const getBookingList = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                b.id AS id,
                b.mssv,
                b.Day,
                DATE_FORMAT(b.start_time, '%H:%i') AS start_time,
                DATE_FORMAT(b.end_time, '%H:%i') AS end_time,
                b.status,
                r.location AS room_name,
                r.qr_code AS qr_code,
                b.booked_seats -- Lấy thêm số chỗ đã đặt
            FROM
                Bookings b
            JOIN
                Rooms r ON b.room_id = r.ID
            ORDER BY
                b.Day DESC, b.start_time ASC
        `;
        connection.query(sql, (err, results) => {
            if (err) {
                console.error("Database error fetching booking list:", err);
                return reject(new Error("Lỗi truy vấn cơ sở dữ liệu khi lấy danh sách đặt chỗ."));
            }
            resolve(results);
        });
    });
};

/**
 * Kiểm tra xem khung giờ đã có lượt đặt nào khác đã xác nhận ('Confirmed')
 * chiếm dụng hay chưa.
 */
const checkBookingTimeSlot = (roomId, date, startTime, endTime, excludeBookingId = null) => { // Thêm excludeBookingId
    return new Promise((resolve, reject) => {
        let overlapQuery = `
            SELECT COUNT(*) AS conflict_count
            FROM Bookings
            WHERE room_id = ?
              AND Day = ?
              AND status = 'Confirmed'
              AND start_time < ?
              AND end_time > ?
        `;
        const values = [roomId, date, endTime, startTime]; 
        if (excludeBookingId !== null && !isNaN(parseInt(excludeBookingId, 10))) {
            overlapQuery += ` AND id != ?`;
            values.push(parseInt(excludeBookingId, 10));
        }

        connection.query(overlapQuery, values, (err, results) => {
            if (err) {
                console.error(`Service Error: Checking time slot for room ${roomId} on ${date} (excluding ${excludeBookingId}):`, err);
                return reject(new Error("Lỗi kiểm tra lịch đặt phòng."));
            }
            const isAvailable = results[0].conflict_count === 0;
            resolve({
                available: isAvailable,
                message: isAvailable ? "Khung thời gian còn trống." : "Khung thời gian đã có người đặt."
            });
        });
    });
};


const addBooking = (bookingData) => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction(async (transactionErr) => {
            if (transactionErr) {
                console.error("Transaction Error: Begin failed:", transactionErr);
                return reject(new Error("Không thể bắt đầu giao dịch cơ sở dữ liệu."));
            }

            try {
                const { room_id, mssv, date, start_time, end_time, number_of_attendees } = bookingData;

                // 1. Basic Validations
                if (!room_id || !mssv || !date || !start_time || !end_time) throw new Error("Thiếu thông tin bắt buộc.");
                if (start_time >= end_time) throw new Error("Thời gian bắt đầu phải trước thời gian kết thúc.");
                const roomIdInt = parseInt(room_id, 10);
                if (isNaN(roomIdInt)) throw new Error("room_id không hợp lệ.");

                // 2. Fetch Room Info & Lock Row
                const roomInfo = await new Promise((res, rej) => {
                    const query = 'SELECT ID, capacity, location, status, available_seats, room_type FROM Rooms WHERE ID = ? FOR UPDATE';
                    connection.query(query, [roomIdInt], (err, results) => {
                        if (err) return rej(new Error("Lỗi truy vấn phòng: " + err.message));
                        if (results.length === 0) return rej(new Error(`Không tìm thấy phòng ID: ${roomIdInt}.`));
                        res(results[0]);
                    });
                });

                // 3. Check Room Status (must be Available)
                if (roomInfo.status !== 'Available') {
                    throw new Error(`Phòng ${roomInfo.location} không khả dụng (Trạng thái: ${roomInfo.status}).`);
                }

                // 4. Determine booked_seats & Validate Attendees/Capacity
                let seatsToDecrement = 0; // Số chỗ sẽ trừ đi và lưu vào booked_seats
                if (roomInfo.room_type === 'single') {
                    seatsToDecrement = 1;
                } else if (roomInfo.room_type === 'group') {
                    const requestedAttendees = parseInt(number_of_attendees, 10);
                    if (isNaN(requestedAttendees) || requestedAttendees <= 0) throw new Error("Số lượng người tham gia không hợp lệ cho phòng nhóm.");
                    if (requestedAttendees > roomInfo.capacity) throw new Error(`Số lượng (${requestedAttendees}) vượt quá sức chứa (${roomInfo.capacity}).`);
                    seatsToDecrement = requestedAttendees;
                } else {
                    throw new Error(`Loại phòng không xác định: ${roomInfo.room_type}`);
                }

                // 5. Check Available Seats
                if (roomInfo.available_seats < seatsToDecrement) {
                    throw new Error(`Không đủ chỗ. Phòng ${roomInfo.location} còn ${roomInfo.available_seats} chỗ (cần ${seatsToDecrement}).`);
                }

                // 6. Check Time Slot Conflict
                const timeSlotCheck = await checkBookingTimeSlot(roomIdInt, date, start_time, end_time);
                if (!timeSlotCheck.available) {
                    throw new Error(timeSlotCheck.message);
                }

                // 7. Insert Booking Record ('Confirmed', booked_seats)
                const bookingResult = await new Promise((res, rej) => {
                    const query = `INSERT INTO Bookings (room_id, mssv, Day, start_time, end_time, status, booked_seats) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    const values = [roomIdInt, mssv, date, start_time, end_time, 'Confirmed', seatsToDecrement];
                    connection.query(query, values, (err, result) => {
                        if (err) {
                             if (err.code === 'ER_DUP_ENTRY') return rej(new Error("Lỗi: Đặt phòng này có vẻ đã tồn tại."));
                             return rej(new Error("Lỗi DB khi tạo đặt phòng: " + err.message));
                        }
                        if (!result || !result.insertId) return rej(new Error("Không thể tạo đặt phòng."));
                        res(result);
                    });
                });

                // 8. Update Room Seats and Status
                const newAvailableSeats = roomInfo.available_seats - seatsToDecrement;
                const newStatus = newAvailableSeats === 0 ? 'Occupied' : 'Available';
                await new Promise((res, rej) => {
                    const query = 'UPDATE Rooms SET available_seats = ?, status = ? WHERE ID = ?';
                    connection.query(query, [newAvailableSeats, newStatus, roomIdInt], (err, result) => {
                        if (err) return rej(new Error("Lỗi cập nhật phòng sau khi đặt: " + err.message));
                        if (result.affectedRows === 0) return rej(new Error("Lỗi không cập nhật được phòng."));
                        res(result);
                    });
                });

                // 9. Commit Transaction
                connection.commit((commitErr) => {
                    if (commitErr) {
                        console.error("Transaction Error: Commit add failed:", commitErr);
                        return connection.rollback(() => reject(new Error("Lỗi xác nhận giao dịch đặt phòng.")));
                    }
                    resolve({ bookingId: bookingResult.insertId, message: "Đặt phòng thành công! Trạng thái: Đã xác nhận." });
                });

            } catch (error) {
                // 10. Rollback Transaction
                console.error("Service Error: Processing booking:", error);
                connection.rollback(() => reject(error)); // Reject với lỗi gốc
            }
        });
    });
};

const updateBookingDetails = (bookingId, mssv, updateData) => {
    return new Promise((resolve, reject) => {
        const bookingIdInt = parseInt(bookingId, 10);
        if (isNaN(bookingIdInt)) return reject(new Error("Booking ID không hợp lệ."));
        if (!mssv) return reject(new Error("Yêu cầu thông tin người dùng để cập nhật."));
        if (Object.keys(updateData).length === 0) return reject(new Error("Không có thông tin nào được cung cấp để cập nhật."));

        connection.beginTransaction(async (transactionErr) => {
            if (transactionErr) return reject(new Error("Lỗi khi bắt đầu giao dịch cập nhật booking."));

            try {
                // 1. Lấy thông tin booking hiện tại & lock
                const bookingInfo = await new Promise((res, rej) => {
                    const query = `SELECT * FROM Bookings WHERE id = ? FOR UPDATE`;
                    connection.query(query, [bookingIdInt], (err, results) => {
                        if (err) return rej(new Error("Lỗi lấy thông tin đặt phòng hiện tại: " + err.message));
                        if (results.length === 0) return rej(new Error(`Không tìm thấy đặt phòng ID: ${bookingIdInt}.`));
                        res(results[0]);
                    });
                });

                // 2. Kiểm tra quyền sở hữu
                if (bookingInfo.mssv !== mssv) {
                    throw new Error("Bạn không có quyền sửa đổi đặt phòng này.");
                }

                // 3. Kiểm tra trạng thái booking (Chỉ cho sửa khi Confirmed?)
                if (bookingInfo.status !== 'Confirmed') {
                    throw new Error(`Không thể sửa đổi đặt phòng đã ở trạng thái '${bookingInfo.status}'.`);
                }

                // 4. Chuẩn bị dữ liệu mới và kiểm tra thay đổi
                const newBookingData = { ...bookingInfo }; // Copy dữ liệu cũ
                const fieldsToUpdate = [];
                const updatedFieldNames = [];

                // Kiểm tra và cập nhật từng trường nếu có trong updateData
                if (updateData.date && updateData.date !== format(new Date(bookingInfo.Day), 'yyyy-MM-dd')) { // So sánh date đúng định dạng
                    // Validate date format if needed
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(updateData.date)) throw new Error("Định dạng ngày không hợp lệ (YYYY-MM-DD).");
                    newBookingData.Day = updateData.date;
                    fieldsToUpdate.push('Day = ?');
                    updatedFieldNames.push('Day');
                }
                if (updateData.start_time && updateData.start_time !== bookingInfo.start_time.substring(0, 5)) { // So sánh HH:MM
                     if (!/^\d{2}:\d{2}(:\d{2})?$/.test(updateData.start_time)) throw new Error("Định dạng giờ bắt đầu không hợp lệ (HH:MM).");
                    newBookingData.start_time = updateData.start_time.padEnd(8, ':00'); // Đảm bảo có giây
                    fieldsToUpdate.push('start_time = ?');
                    updatedFieldNames.push('start_time');
                }
                 if (updateData.end_time && updateData.end_time !== bookingInfo.end_time.substring(0, 5)) { // So sánh HH:MM
                     if (!/^\d{2}:\d{2}(:\d{2})?$/.test(updateData.end_time)) throw new Error("Định dạng giờ kết thúc không hợp lệ (HH:MM).");
                     if (newBookingData.start_time >= updateData.end_time.padEnd(8, ':00')) throw new Error("Giờ bắt đầu phải trước giờ kết thúc.");
                     newBookingData.end_time = updateData.end_time.padEnd(8, ':00');
                     fieldsToUpdate.push('end_time = ?');
                     updatedFieldNames.push('end_time');
                }

                let seatsChanged = false;
                let seatDifference = 0;
                let newBookedSeats = bookingInfo.booked_seats;

                if (updateData.number_of_attendees !== undefined) {
                    const requestedAttendees = parseInt(updateData.number_of_attendees, 10);
                    if (isNaN(requestedAttendees) || requestedAttendees <= 0) throw new Error("Số lượng người tham gia không hợp lệ.");

                    if (requestedAttendees !== bookingInfo.booked_seats) {
                         // Lấy thông tin phòng để kiểm tra capacity và available_seats
                         const roomInfo = await new Promise((res, rej) => {
                            const query = 'SELECT capacity, available_seats, room_type FROM Rooms WHERE ID = ? FOR UPDATE';
                            connection.query(query, [bookingInfo.room_id], (err, results) => {
                                if (err || results.length === 0) return rej(new Error("Không thể lấy thông tin phòng để kiểm tra chỗ ngồi."));
                                res(results[0]);
                            });
                        });

                        if(roomInfo.room_type !== 'group' && requestedAttendees > 1) {
                            throw new Error(`Phòng đơn không thể cập nhật số lượng người tham gia lớn hơn 1.`);
                        }
                        if(roomInfo.room_type === 'single') newBookedSeats = 1; // Phòng đơn luôn là 1
                        else newBookedSeats = requestedAttendees;


                        if (newBookedSeats > roomInfo.capacity) throw new Error(`Số lượng mới (${newBookedSeats}) vượt quá sức chứa (${roomInfo.capacity}).`);

                        seatDifference = newBookedSeats - bookingInfo.booked_seats;
                        const requiredAvailableSeatsForChange = seatDifference > 0 ? seatDifference : 0; // Chỉ cần check nếu số người tăng

                        if (roomInfo.available_seats < requiredAvailableSeatsForChange) {
                             throw new Error(`Không đủ chỗ trống để tăng số người tham gia. Phòng còn ${roomInfo.available_seats} chỗ.`);
                        }

                        newBookingData.booked_seats = newBookedSeats;
                        fieldsToUpdate.push('booked_seats = ?');
                        updatedFieldNames.push('booked_seats');
                        seatsChanged = true;
                    }
                }

                // Nếu không có gì thay đổi -> báo thành công nhưng không làm gì
                 if (fieldsToUpdate.length === 0) {
                     connection.commit(); // Vẫn commit để giải phóng lock
                     return resolve({ message: "Không có thông tin nào cần cập nhật.", updatedFields: [] });
                 }

                // 5. Kiểm tra xung đột thời gian nếu thời gian thay đổi
                const timeChanged = updatedFieldNames.includes('Day') || updatedFieldNames.includes('start_time') || updatedFieldNames.includes('end_time');
                if (timeChanged) {
                    const timeSlotCheck = await checkBookingTimeSlot(
                        bookingInfo.room_id,
                        newBookingData.Day, // Ngày đã cập nhật (nếu có)
                        newBookingData.start_time, // Giờ bắt đầu đã cập nhật (nếu có)
                        newBookingData.end_time,   // Giờ kết thúc đã cập nhật (nếu có)
                        bookingIdInt // Loại trừ booking hiện tại khỏi kiểm tra
                    );
                    if (!timeSlotCheck.available) {
                        throw new Error(`Khung thời gian mới (${newBookingData.Day} ${newBookingData.start_time}-${newBookingData.end_time}) bị trùng lịch.`);
                    }
                }

                // 6. Thực hiện cập nhật Booking
                const updateBookingQuery = `UPDATE Bookings SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
                const updateBookingValues = updatedFieldNames.map(field => newBookingData[field]); // Lấy giá trị mới tương ứng
                updateBookingValues.push(bookingIdInt);

                await new Promise((res, rej) => {
                    connection.query(updateBookingQuery, updateBookingValues, (err, result) => {
                        if (err) return rej(new Error("Lỗi cập nhật thông tin đặt phòng: " + err.message));
                        if (result.affectedRows === 0) return rej(new Error("Không thể cập nhật đặt phòng (ID không tìm thấy hoặc không có gì thay đổi)."));
                        res(result);
                    });
                });

                // 7. Cập nhật Room nếu số chỗ thay đổi
                if (seatsChanged && seatDifference !== 0) {
                     await new Promise((res, rej) => {
                        // Giảm available_seats nếu seatDifference > 0 (thêm người)
                        // Tăng available_seats nếu seatDifference < 0 (bớt người)
                        const q = 'UPDATE Rooms SET available_seats = available_seats - ? WHERE ID = ?';
                        connection.query(q, [seatDifference, bookingInfo.room_id], (err, result) => {
                            if (err) return rej(new Error("Lỗi cập nhật số chỗ trống của phòng: " + err.message));
                            if (result.affectedRows === 0) return rej(new Error("Không thể cập nhật phòng (ID không tìm thấy?)."));
                             // Cần cập nhật lại trạng thái phòng Available/Occupied nếu cần (logic phức tạp hơn, tạm bỏ qua)
                            res(result);
                        });
                    });
                }

                // 8. Commit transaction
                connection.commit((commitErr) => {
                    if (commitErr) return connection.rollback(() => reject(new Error("Lỗi xác nhận giao dịch cập nhật booking.")));
                    resolve({ message: `Cập nhật đặt phòng ID ${bookingIdInt} thành công.`, updatedFields: updatedFieldNames });
                });

            } catch (error) {
                connection.rollback(() => reject(error)); // reject với lỗi gốc
            }
        });
    });
};
const cancelBooking = (bookingId) => {
    return new Promise((resolve, reject) => {
        const bookingIdInt = parseInt(bookingId, 10);
        if (isNaN(bookingIdInt)) return reject(new Error("Booking ID không hợp lệ."));

        connection.beginTransaction(async (transactionErr) => {
            if (transactionErr) {
                console.error("Transaction Error: Begin cancel failed:", transactionErr);
                return reject(new Error("Không thể bắt đầu giao dịch hủy."));
            }

            try {
                // 1. Lấy booking info & lock (id, room_id, status, booked_seats)
                const bookingInfo = await new Promise((res, rej) => {
                    const query = `SELECT id, room_id, status, booked_seats FROM Bookings WHERE id = ? FOR UPDATE`;
                    connection.query(query, [bookingIdInt], (err, results) => {
                        if (err) return rej(new Error("Lỗi lấy thông tin đặt phòng: " + err.message));
                        if (results.length === 0) return rej(new Error(`Không tìm thấy đặt phòng ID: ${bookingIdInt}.`));
                        res(results[0]);
                    });
                });

                // 2. Kiểm tra trạng thái hợp lệ ('Confirmed')
                if (bookingInfo.status !== 'Confirmed') {
                    throw new Error(`Chỉ hủy được đặt phòng 'Confirmed'. Trạng thái hiện tại: '${bookingInfo.status}'.`);
                }

                // 3. Lấy room info & lock (ID, capacity, available_seats, status)
                const roomInfo = await new Promise((res, rej) => {
                    const query = `SELECT ID, capacity, available_seats, status FROM Rooms WHERE ID = ? FOR UPDATE`;
                    connection.query(query, [bookingInfo.room_id], (err, results) => {
                         if (err) return rej(new Error("Lỗi lấy thông tin phòng: " + err.message));
                         if (results.length === 0) return rej(new Error(`Lỗi dữ liệu: Phòng ID ${bookingInfo.room_id} không tồn tại.`));
                         res(results[0]);
                    });
                });

                // 4. Cập nhật booking status -> 'Cancelled'
                await new Promise((res, rej) => {
                    const query = 'UPDATE Bookings SET status = ? WHERE id = ?';
                    connection.query(query, ['Cancelled', bookingIdInt], (err, result) => {
                         if (err) return rej(new Error("Lỗi cập nhật trạng thái booking: " + err.message));
                         if (result.affectedRows === 0) return rej(new Error("Lỗi không cập nhật được booking."));
                         res(result);
                    });
                });

                // 5. Cập nhật lại số chỗ trống và trạng thái phòng
                let newAvailableSeats = roomInfo.available_seats;
                let newRoomStatus = roomInfo.status;
                const seatsToAddBack = bookingInfo.booked_seats || 0;
                let roomNeedsUpdate = false;

                if (seatsToAddBack > 0 && roomInfo.status !== 'Maintenance') {
                    newAvailableSeats = roomInfo.available_seats + seatsToAddBack;
                    newAvailableSeats = Math.min(newAvailableSeats, roomInfo.capacity);
                    if (roomInfo.status === 'Occupied' && newAvailableSeats > 0) {
                        newRoomStatus = 'Available';
                    }
                    if (newAvailableSeats !== roomInfo.available_seats || newRoomStatus !== roomInfo.status) {
                        roomNeedsUpdate = true;
                    }
                } else { /* Log warnings if needed */ }

                if (roomNeedsUpdate) {
                    await new Promise((res, rej) => {
                        const query = 'UPDATE Rooms SET available_seats = ?, status = ? WHERE ID = ?';
                        connection.query(query, [newAvailableSeats, newRoomStatus, roomInfo.ID], (err, result) => {
                            if (err) return rej(new Error("Lỗi cập nhật phòng sau khi hủy: " + err.message));
                            if (result.affectedRows === 0) return rej(new Error("Lỗi không cập nhật được phòng sau hủy."));
                            res(result);
                        });
                    });
                }

                // 6. Commit
                connection.commit((commitErr) => {
                    if (commitErr) {
                        console.error("Transaction Error: Commit cancel failed:", commitErr);
                        return connection.rollback(() => reject(new Error("Lỗi xác nhận giao dịch hủy.")));
                    }
                    resolve({ message: `Hủy lượt đặt phòng ID ${bookingIdInt} thành công.` });
                });

            } catch (error) {
                // 7. Rollback
                console.error(`Service Error: Cancelling booking ID ${bookingIdInt}:`, error);
                connection.rollback(() => reject(error));
            }
        });
    });
};

// --- Hàm cho Cron Job (Có thể đặt ở file riêng) ---

/**
 * Tác vụ định kỳ: Hoàn thành các đặt phòng đã hết hạn ('Confirmed' -> 'Completed')
 * và cộng lại chỗ trống cho phòng (cả đơn và nhóm).
 */
const processCompletedBookings = () => {
    return new Promise(async (resolve, reject) => {
        const functionName = 'processCompletedBookings';
        console.log(`[${new Date().toISOString()}] Running job: ${functionName}...`);
        let completedCount = 0;
        let roomUpdateCount = 0;
        let failedCount = 0;

        try {
            const findQuery = `
                SELECT id, room_id, booked_seats, status AS current_status
                FROM Bookings
                WHERE status IN ('Confirmed', 'CheckedIn')
                  -- Sử dụng CONVERT_TZ để tính đúng thời gian kết thúc theo giờ địa phương (+07)
                  AND TIMESTAMP(DATE(CONVERT_TZ(Day, '+00:00', '+07:00')), end_time) < NOW()
            `;
            console.log("--- [DEBUG] Cron Job Using findQuery:", findQuery);
            const bookingsToComplete = await new Promise((res, rej) => {
                connection.query(findQuery, (err, results) => {
                    // Thêm log chi tiết vào callback này như đã hướng dẫn trước
                    if (err) {
                        console.error("--- [DEBUG] Cron Job ERROR executing findQuery:", err);
                        return rej(new Error(`[${functionName}] Lỗi tìm booking hết hạn: ${err.message}`));
                    }
                    console.log(`--- [DEBUG] Cron Job findQuery results count: ${results ? results.length : 'N/A'}`);
                    if (results && results.length > 0) {
                        console.log(`--- [DEBUG] Cron Job Found Booking IDs: ${results.map(b => b.id).join(', ')}`);
                    }
                    // --- Kết thúc log debug trong callback ---
                    res(results);
                });
            });

            if (bookingsToComplete.length === 0) {
                console.log(`[${functionName}] No active bookings found past their end time.`);
                return resolve({ completed: 0, room_updates: 0, failed: 0, message: "Không có đặt phòng nào cần hoàn thành." });
            }
            console.log(`[${functionName}] Found ${bookingsToComplete.length} bookings to process.`);

            // 2. Lặp và xử lý từng booking trong transaction riêng (Logic remains the same)
            for (const booking of bookingsToComplete) {
                await new Promise((res_inner) => {
                    connection.beginTransaction(async (transactionErr) => {
                        if (transactionErr) {
                            console.error(`[${functionName}] TX Begin Error (Booking ${booking.id}):`, transactionErr);
                            failedCount++;
                            return res_inner();
                        }

                        try {
                            // 3. Lấy thông tin phòng & lock
                            const roomInfo = await new Promise((res_room, rej_room) => {
                                const q = 'SELECT ID, capacity, available_seats, status FROM Rooms WHERE ID = ? FOR UPDATE';
                                connection.query(q, [booking.room_id], (err, results) => {
                                     if (err || results.length === 0) return rej_room(new Error(`[${functionName}] Lỗi/Không tìm thấy phòng ${booking.room_id} (Booking ${booking.id}). ${err?.message || ''}`));
                                     res_room(results[0]);
                                });
                            });

                            // 4. Cập nhật booking status -> 'Completed'
                            let bookingUpdated = false;
                            await new Promise((res_b, rej_b) => {
                                const q = 'UPDATE Bookings SET status = ? WHERE id = ? AND status IN (?, ?)';
                                connection.query(q, ['Completed', booking.id, 'Confirmed', 'CheckedIn'], (err, result) => {
                                    if (err) return rej_b(new Error(`[${functionName}] Lỗi cập nhật booking ${booking.id}: ${err.message}`));
                                    if (result.affectedRows > 0) {
                                        bookingUpdated = true;
                                        completedCount++;
                                    } else {
                                        console.warn(`[${functionName}] Booking ${booking.id} không còn ở trạng thái 'Confirmed' hoặc 'CheckedIn' khi xử lý.`);
                                    }
                                    res_b(result);
                                });
                            });

                            // 5. Nếu booking được cập nhật -> Cập nhật phòng (giải phóng chỗ)
                            if (bookingUpdated) {
                                let newAvailableSeats = roomInfo.available_seats;
                                let newRoomStatus = roomInfo.status;
                                const seatsToAddBack = booking.booked_seats || 0;
                                let roomNeedsUpdate = false;

                                if (seatsToAddBack > 0 && roomInfo.status !== 'Maintenance') {
                                    newAvailableSeats = roomInfo.available_seats + seatsToAddBack;
                                    newAvailableSeats = Math.min(newAvailableSeats, roomInfo.capacity);

                                    if (roomInfo.status === 'Occupied' && newAvailableSeats > 0) {
                                        newRoomStatus = 'Available';
                                    }
                                    if (newAvailableSeats !== roomInfo.available_seats || newRoomStatus !== roomInfo.status) {
                                        roomNeedsUpdate = true;
                                    }
                                } else if (seatsToAddBack <= 0) {
                                     console.warn(`[${functionName}] Booking ${booking.id} has booked_seats = ${seatsToAddBack}. No seats added back.`);
                                }

                                if (roomNeedsUpdate) {
                                    await new Promise((res_r, rej_r) => {
                                        const q = 'UPDATE Rooms SET available_seats = ?, status = ? WHERE ID = ?';
                                        connection.query(q, [newAvailableSeats, newRoomStatus, roomInfo.ID], (err, result) => {
                                            if (err) return rej_r(new Error(`[${functionName}] Lỗi cập nhật phòng ${roomInfo.ID}: ${err.message}`));
                                            if (result.affectedRows === 0) return rej_r(new Error(`[${functionName}] Lỗi không cập nhật được phòng ${roomInfo.ID}.`));
                                            roomUpdateCount++;
                                            res_r(result);
                                        });
                                    });
                                }
                            } // end if(bookingUpdated)

                            // 6. Commit transaction
                            connection.commit((commitErr) => {
                                if (commitErr) {
                                    console.error(`[${functionName}] TX Commit Error (Booking ${booking.id}):`, commitErr);
                                    connection.rollback(() => {
                                        if (bookingUpdated) completedCount--;
                                        failedCount++;
                                        res_inner();
                                    });
                                } else {
                                    if (bookingUpdated) console.log(`[${functionName}] Booking ${booking.id} (${booking.current_status}) -> Completed. Room ${roomInfo.ID} updated.`);
                                    res_inner();
                                }
                            });

                        } catch (error) {
                            // 7. Rollback on error
                            console.error(`[${functionName}] Error processing Booking ${booking.id}:`, error);
                            connection.rollback(() => {
                                failedCount++;
                                res_inner();
                            });
                        }
                    }); // End beginTransaction
                }); // End new Promise wrapper
            } // End for loop

            resolve({ completed: completedCount, room_updates: roomUpdateCount, failed: failedCount, message: `Hoàn thành ${completedCount} đặt chỗ, cập nhật ${roomUpdateCount} phòng, ${failedCount} lỗi.` });

        } catch (error) {
            console.error(`[${functionName}] Job Error:`, error);
            reject(error);
        }
    });
};

const bookNow = ({ roomId, mssv, duration_minutes, number_of_attendees }) => {
    return new Promise((resolve, reject) => {
        const functionName = 'bookNow';
        const roomIdInt = parseInt(roomId, 10);

        if (isNaN(roomIdInt)) return reject(new Error("Room ID không hợp lệ."));
        if (!mssv) return reject(new Error("Thiếu thông tin người dùng (MSSV)."));

        // Chuyển đổi duration_minutes và number_of_attendees thành số hoặc null nếu không hợp lệ/không cung cấp
        const requestedDuration = duration_minutes ? parseInt(duration_minutes, 10) : null;
        const requestedAttendees = number_of_attendees ? parseInt(number_of_attendees, 10) : null;

        connection.beginTransaction(async (transactionErr) => {
            if (transactionErr) {
                console.error(`[${functionName}] TX Begin Error:`, transactionErr);
                return reject(new Error("Lỗi khi bắt đầu giao dịch đặt phòng ngay."));
            }

            try {
                // 1. Lấy thông tin phòng và khóa bản ghi
                const roomInfo = await new Promise((res, rej) => {
                    const query = 'SELECT ID, capacity, location, status, available_seats, room_type FROM Rooms WHERE ID = ? FOR UPDATE';
                    connection.query(query, [roomIdInt], (err, results) => {
                         if (err) return rej(new Error(`[${functionName}] Lỗi lấy phòng ${roomIdInt}: ${err.message}`));
                         if (results.length === 0) return rej(new Error(`[${functionName}] Không tìm thấy phòng ID: ${roomIdInt}.`));
                         res(results[0]);
                    });
                });

                // 2. Kiểm tra trạng thái phòng
                if (roomInfo.status !== 'Available') {
                    throw new Error(`Phòng ${roomInfo.location} hiện không trống (Trạng thái: ${roomInfo.status}). Không thể đặt ngay.`);
                }

                // 3. Xác định thời gian đặt và số người tham gia cuối cùng (áp dụng mặc định nếu cần)
                let effective_duration_minutes;
                let seatsToDecrement;

                if (roomInfo.room_type === 'single') {
                    // Phòng đơn: Dùng duration người dùng cung cấp hoặc mặc định 60 phút
                    effective_duration_minutes = (requestedDuration && requestedDuration > 0) ? requestedDuration : DEFAULT_BOOKING_DURATION_MINUTES;
                    seatsToDecrement = DEFAULT_SINGLE_ATTENDEES; // Luôn là 1 cho phòng đơn
                } else if (roomInfo.room_type === 'group') {
                    // Phòng nhóm: Dùng duration người dùng cung cấp hoặc mặc định 120 phút
                    effective_duration_minutes = (requestedDuration && requestedDuration > 0) ? requestedDuration : DEFAULT_DURATION_QUICK_BOOK_MINUTES; // Mặc định 120 phút

                    // Phòng nhóm: Dùng số người dùng cung cấp hoặc mặc định 6 người
                    let attendees = (requestedAttendees && requestedAttendees > 0) ? requestedAttendees : DEFAULT_GROUP_ATTENDEES; // Mặc định 6 người

                    // Kiểm tra sức chứa
                    if (attendees > roomInfo.capacity) {
                        throw new Error(`Số lượng (${attendees}) vượt quá sức chứa (${roomInfo.capacity}) của phòng nhóm.`);
                    }
                    seatsToDecrement = attendees;
                } else {
                    throw new Error(`[${functionName}] Loại phòng không xác định: ${roomInfo.room_type}`);
                }

                // Kiểm tra lại nếu duration_minutes sau khi xác định không hợp lệ (dù logic trên đã xử lý)
                 if (isNaN(effective_duration_minutes) || effective_duration_minutes <= 0) {
                    return reject(new Error("Thời gian đặt phòng cuối cùng không hợp lệ."));
                 }

                // 4. Tính toán thời gian bắt đầu/kết thúc
                const now = new Date();
                const startTime = now;
                const endTime = new Date(now.getTime() + effective_duration_minutes * 60000);

                const bookingDate = format(startTime, 'yyyy-MM-dd');
                const startTimeStr = format(startTime, 'HH:mm:ss');
                const endTimeStr = format(endTime, 'HH:mm:ss');


                // 5. Kiểm tra chỗ trống
                if (roomInfo.available_seats < seatsToDecrement) {
                    throw new Error(`Không đủ chỗ trống. Phòng ${roomInfo.location} chỉ còn ${roomInfo.available_seats} chỗ (cần ${seatsToDecrement}).`);
                }

                // 6. Kiểm tra xung đột thời gian
                const timeSlotCheck = await checkBookingTimeSlot(roomIdInt, bookingDate, startTimeStr, endTimeStr);
                if (!timeSlotCheck.available) {
                    throw new Error("Rất tiếc, đã có lịch đặt khác trùng với khoảng thời gian này.");
                }

                // 7. Tạo bản ghi đặt phòng
                const bookingResult = await new Promise((res, rej) => {
                    const query = `INSERT INTO Bookings (room_id, mssv, Day, start_time, end_time, status, booked_seats) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    const values = [roomIdInt, mssv, bookingDate, startTimeStr, endTimeStr, 'Confirmed', seatsToDecrement];
                    connection.query(query, values, (err, result) => {
                         if (err) {
                             if (err.code === 'ER_DUP_ENTRY') return rej(new Error("Lỗi: Có vẻ đã có một đặt phòng trùng khớp."));
                             return rej(new Error(`[${functionName}] Lỗi DB khi tạo booking: ${err.message}`));
                         }
                         if (!result || !result.insertId) return rej(new Error(`[${functionName}] Không thể tạo đặt phòng.`));
                         res(result);
                    });
                });

                // 8. Cập nhật số chỗ và trạng thái phòng
                const newAvailableSeats = roomInfo.available_seats - seatsToDecrement;
                const newStatus = newAvailableSeats <= 0 ? 'Occupied' : 'Available'; // <= 0 để an toàn
                await new Promise((res, rej) => {
                    const query = 'UPDATE Rooms SET available_seats = ?, status = ? WHERE ID = ?';
                    connection.query(query, [newAvailableSeats, newStatus, roomIdInt], (err, result) => {
                        if (err) return rej(new Error(`[${functionName}] Lỗi cập nhật phòng ${roomIdInt}: ${err.message}`));
                        if (result.affectedRows === 0) return rej(new Error(`[${functionName}] Lỗi không cập nhật được phòng ${roomIdInt}.`));
                        res(result);
                    });
                });

                // 9. Commit transaction
                connection.commit((commitErr) => {
                    if (commitErr) {
                        console.error(`[${functionName}] TX Commit Error:`, commitErr);
                        return connection.rollback(() => reject(new Error("Lỗi khi xác nhận giao dịch đặt phòng ngay.")));
                    }
                    resolve({
                        bookingId: bookingResult.insertId,
                        message: `Đặt phòng ${roomInfo.location} thành công!`,
                        startTime: startTimeStr,
                        endTime: endTimeStr,
                        date: bookingDate,
                        attendees: seatsToDecrement, // Trả về số người thực tế đã đặt
                        duration_minutes: effective_duration_minutes // Trả về thời gian thực tế đã đặt
                    });
                });

            } catch (error) {
                console.error(`[${functionName}] Error during transaction:`, error);
                connection.rollback(() => reject(error)); // Reject với lỗi gốc để controller xử lý
            }
        });
    });
};

const getBookingsByMssv = (mssv) => {
    return new Promise((resolve, reject) => {
        if (!mssv) {
            return reject(new Error("MSSV là bắt buộc."));
        }

        const sql = `
            SELECT
                b.id AS booking_id,
                b.mssv,
                b.Day,
                DATE_FORMAT(b.start_time, '%H:%i') AS start_time,
                DATE_FORMAT(b.end_time, '%H:%i') AS end_time,
                b.status,
                r.location AS room_name, -- Coi 'location' như thông tin 'thiết bị'/phòng
                r.qr_code,
                r.room_type,             -- Thêm loại phòng nếu cần
                b.booked_seats           -- Thêm số chỗ đã đặt nếu cần
            FROM
                Bookings b
            JOIN
                Rooms r ON b.room_id = r.ID
            WHERE
                b.mssv = ?
            ORDER BY
                b.Day DESC, b.start_time ASC;
        `;

        connection.query(sql, [mssv], (err, results) => {
            if (err) {
                console.error(`Database error fetching bookings for MSSV ${mssv}:`, err);
                return reject(new Error("Lỗi truy vấn cơ sở dữ liệu khi lấy đặt chỗ của sinh viên."));
            }
            // Results sẽ là một mảng các object đặt phòng
            resolve(results);
        });
    });
};
const checkInBooking = (bookingId, mssv, roomId = null) => {
    return new Promise((resolve, reject) => {
        const bookingIdInt = parseInt(bookingId, 10);
        if (isNaN(bookingIdInt)) return reject(new Error("Booking ID không hợp lệ."));
        if (!mssv) return reject(new Error("MSSV là bắt buộc để check-in."));

        connection.beginTransaction(async (transactionErr) => {
            if (transactionErr) return reject(new Error("Lỗi khi bắt đầu giao dịch check-in."));
            try {
                const bookingInfo = await new Promise((res, rej) => {
                    const query = `SELECT id, room_id, mssv, status, start_time, end_time, Day FROM Bookings WHERE id = ? FOR UPDATE`;
                    connection.query(query, [bookingIdInt], (err, results) => {
                        if (err) return rej(new Error("Lỗi lấy thông tin đặt phòng: " + err.message));
                        if (results.length === 0) return rej(new Error(`Không tìm thấy đặt phòng ID: ${bookingIdInt}.`));
                        res(results[0]);
                    });
                });

                if (bookingInfo.mssv !== mssv) throw new Error(`Người dùng ${mssv} không có quyền check-in cho đặt phòng này.`);
                if (roomId !== null) {
                    const roomIdInt = parseInt(roomId, 10);
                    if (isNaN(roomIdInt) || bookingInfo.room_id !== roomIdInt) throw new Error(`Check-in không đúng phòng (Yêu cầu: ${roomIdInt}, Đặt phòng: ${bookingInfo.room_id}).`);
                }
                if (bookingInfo.status !== 'Confirmed') throw new Error(`Chỉ có thể check-in khi đặt phòng ở trạng thái 'Confirmed'. Trạng thái hiện tại: '${bookingInfo.status}'.`);

                await new Promise((res, rej) => {
                    const query = 'UPDATE Bookings SET status = ? WHERE id = ? AND status = ?';
                    connection.query(query, ['CheckedIn', bookingIdInt, 'Confirmed'], (err, result) => {
                         if (err) return rej(new Error("Lỗi cập nhật trạng thái check-in: " + err.message));
                         if (result.affectedRows === 0) return rej(new Error("Không thể cập nhật trạng thái check-in (có thể trạng thái đã thay đổi)."));
                         res(result);
                    });
                });

                connection.commit((commitErr) => {
                    if (commitErr) return connection.rollback(() => reject(new Error("Lỗi xác nhận giao dịch check-in.")));
                    resolve({ message: `Check-in thành công cho đặt phòng ID ${bookingIdInt}.` });
                });
            } catch (error) {
                connection.rollback(() => reject(error));
            }
        });
    });
};

const checkOutBooking = (bookingId, mssv) => {
     return new Promise((resolve, reject) => {
        const bookingIdInt = parseInt(bookingId, 10);
        if (isNaN(bookingIdInt)) return reject(new Error("Booking ID không hợp lệ."));
        if (!mssv) return reject(new Error("MSSV là bắt buộc để check-out."));

        connection.beginTransaction(async (transactionErr) => {
            if (transactionErr) return reject(new Error("Lỗi khi bắt đầu giao dịch check-out."));
            try {
                const bookingInfo = await new Promise((res, rej) => {
                    const query = `SELECT id, room_id, mssv, status, booked_seats FROM Bookings WHERE id = ? FOR UPDATE`;
                    connection.query(query, [bookingIdInt], (err, results) => {
                        if (err) return rej(new Error("Lỗi lấy thông tin đặt phòng: " + err.message));
                        if (results.length === 0) return rej(new Error(`Không tìm thấy đặt phòng ID: ${bookingIdInt}.`));
                        res(results[0]);
                    });
                });

                if (bookingInfo.mssv !== mssv) throw new Error(`Người dùng ${mssv} không có quyền check-out cho đặt phòng này.`);
                if (bookingInfo.status !== 'CheckedIn') throw new Error(`Chỉ có thể check-out khi đặt phòng ở trạng thái 'CheckedIn'. Trạng thái hiện tại: '${bookingInfo.status}'.`);

                 const roomInfo = await new Promise((res_room, rej_room) => {
                    const q = 'SELECT ID, capacity, available_seats, status FROM Rooms WHERE ID = ? FOR UPDATE';
                    connection.query(q, [bookingInfo.room_id], (err, results) => {
                         if (err || results.length === 0) return rej_room(new Error(`Lỗi/Không tìm thấy phòng ${bookingInfo.room_id}.`));
                         res_room(results[0]);
                    });
                });

                await new Promise((res, rej) => {
                    const query = 'UPDATE Bookings SET status = ? WHERE id = ? AND status = ?';
                    connection.query(query, ['Completed', bookingIdInt, 'CheckedIn'], (err, result) => {
                         if (err) return rej(new Error("Lỗi cập nhật trạng thái check-out: " + err.message));
                         if (result.affectedRows === 0) return rej(new Error("Không thể cập nhật trạng thái check-out (có thể trạng thái đã thay đổi)."));
                         res(result);
                    });
                });

                let newAvailableSeats = roomInfo.available_seats;
                let newRoomStatus = roomInfo.status;
                const seatsToAddBack = bookingInfo.booked_seats || 0;
                let roomNeedsUpdate = false;

                if (seatsToAddBack > 0 && roomInfo.status !== 'Maintenance') {
                    newAvailableSeats = Math.min(roomInfo.available_seats + seatsToAddBack, roomInfo.capacity);
                    if (roomInfo.status === 'Occupied' && newAvailableSeats > 0) newRoomStatus = 'Available';
                    if (newAvailableSeats !== roomInfo.available_seats || newRoomStatus !== roomInfo.status) roomNeedsUpdate = true;
                }

                if (roomNeedsUpdate) {
                    await new Promise((res_r, rej_r) => {
                        const q = 'UPDATE Rooms SET available_seats = ?, status = ? WHERE ID = ?';
                        connection.query(q, [newAvailableSeats, newRoomStatus, roomInfo.ID], (err, result) => {
                            if (err) return rej_r(new Error("Lỗi cập nhật phòng sau khi check-out: " + err.message));
                            if (result.affectedRows === 0) return rej_r(new Error("Lỗi không cập nhật được phòng sau check-out."));
                            res_r(result);
                        });
                    });
                }

                connection.commit((commitErr) => {
                    if (commitErr) return connection.rollback(() => reject(new Error("Lỗi xác nhận giao dịch check-out.")));
                    resolve({ message: `Check-out và hoàn thành thành công cho đặt phòng ID ${bookingIdInt}.` });
                });
            } catch (error) {
                connection.rollback(() => reject(error));
            }
        });
    });
};
const getBookingDetailsById = (bookingId) => {
    return new Promise(async (resolve, reject) => {
        const bookingIdInt = parseInt(bookingId, 10);
        if (isNaN(bookingIdInt)) {
            return reject(new Error("Booking ID không hợp lệ."));
        }

        const sql = `
            SELECT
                b.id AS booking_id,
                b.status AS booking_status,
                b.Day AS booking_day, -- Giữ nguyên kiểu DATE/DATETIME
                b.start_time,       -- Giữ nguyên kiểu TIME
                b.end_time,         -- Giữ nguyên kiểu TIME
                b.booked_seats,
                b.createdAt AS booking_createdAt,
                u.mssv,
                u.fullName AS user_fullName,
                u.email AS user_email,
                u.phone AS user_phone,
                r.ID AS room_id,
                r.location AS room_location,
                r.capacity AS room_capacity,
                r.available_seats AS room_available_seats,
                r.room_type,
                r.status AS room_status,
                r.qr_code AS room_qr_code
            FROM
                Bookings b
            JOIN
                Users u ON b.mssv = u.mssv
            JOIN
                Rooms r ON b.room_id = r.ID
            WHERE
                b.id = ?;
        `;

        try {
            const bookingDetails = await new Promise((res, rej) => {
                connection.query(sql, [bookingIdInt], (err, results) => {
                    if (err) {
                        console.error(`Database error fetching details for booking ${bookingIdInt}:`, err);
                        return rej(new Error("Lỗi truy vấn chi tiết đặt phòng."));
                    }
                    if (results.length === 0) {
                        return res(null); 
                    }
                    res(results[0]); 
                });
            });

            if (!bookingDetails) {
                return resolve(null);
            }
            const devices = await deviceService.getDevicesByRoomId(bookingDetails.room_id);
            bookingDetails.room_devices = devices;

            resolve(bookingDetails); 

        } catch (error) {
            reject(error);
        }
    });
};


module.exports = {
    getBookingList,
    addBooking,
    checkBookingTimeSlot,
    cancelBooking,
    processCompletedBookings,
    bookNow,
    getBookingsByMssv,
    checkOutBooking,
    checkInBooking,
    updateBookingDetails,
    getBookingDetailsById
};