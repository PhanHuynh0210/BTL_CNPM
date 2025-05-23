import bookingService from '../service/bookingService';

function combineDateTime(dateString, timeString) {
    if (!dateString || !timeString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString) || !/^\d{2}:\d{2}$/.test(timeString)) {
        return null; // Trả về null nếu định dạng sai
    }
    // Giả định client gửi đúng định dạng giờ, thêm giây ':00'
    return `${dateString} ${timeString}:00`;
}

const createBooking = async (req, res) => {
    try {
        const loggedInUser = req.user;
        console.log("Payload received in createBooking (req.user):", loggedInUser);

        // Kiểm tra sự tồn tại của loggedInUser và trường mssv
        if (!loggedInUser || !loggedInUser.mssv) {
             console.error("Authentication check failed: Missing user or mssv in token payload.");
             return res.status(401).json({ success: false, message: "Yêu cầu đăng nhập hoặc token không chứa đủ thông tin." });
        }

        // Nhận dữ liệu từ client
        const { room_id, date, start_time, end_time, number_of_attendees } = req.body;

        // Validation đầu vào cơ bản
        if (!room_id || !date || !start_time || !end_time) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin phòng, ngày hoặc thời gian." });
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}(:\d{2})?$/.test(start_time) || !/^\d{2}:\d{2}(:\d{2})?$/.test(end_time)) {
            return res.status(400).json({ success: false, message: "Định dạng ngày (YYYY-MM-DD) hoặc giờ (HH:MM hoặc HH:MM:SS) không hợp lệ." });
        }

        // Chuẩn bị dữ liệu cho service THEO ĐÚNG YÊU CẦU CỦA SERVICE MỚI
        const bookingData = {
            room_id: parseInt(room_id, 10),
            mssv: loggedInUser.mssv,      // <-- GỬI MSSV
            date: date,                   // <-- GỬI NGÀY RIÊNG
            start_time: start_time,       // <-- GỬI GIỜ BẮT ĐẦU RIÊNG
            end_time: end_time,           // <-- GỬI GIỜ KẾT THÚC RIÊNG
            number_of_attendees: number_of_attendees ? parseInt(number_of_attendees, 10) : undefined
            // KHÔNG GỬI user_id nữa
        };

        // Validation kiểu số
         if (isNaN(bookingData.room_id)) {
              return res.status(400).json({ success: false, message: "ID phòng không hợp lệ." });
         }
         if (bookingData.number_of_attendees !== undefined && isNaN(bookingData.number_of_attendees)) {
              return res.status(400).json({ success: false, message: "Số lượng người tham gia không hợp lệ." });
         }

        console.log('BE Controller: Sending data to service:', bookingData); // Log dữ liệu sẽ gửi đi

        // Gọi service với dữ liệu đã chuẩn bị
        const result = await bookingService.addBooking(bookingData); // Service addBooking phải được cập nhật để nhận các trường này

        // Trả về kết quả thành công
        return res.status(201).json({
            success: true,
            message: result.message,
            bookingId: result.bookingId
        });

    } catch (error) {
        // Xử lý lỗi tập trung
        console.error("Controller Error: Creating booking:", error);
        let statusCode = 500;
        const errorMessage = error.message || "Lỗi không xác định khi xử lý đặt phòng.";

        if (errorMessage.includes("Thiếu thông tin") || errorMessage.includes("không hợp lệ") || errorMessage.includes("Vui lòng nhập số lượng")) {
            statusCode = 400;
        } else if (errorMessage.includes("vượt quá sức chứa")) {
            statusCode = 400;
        } else if (errorMessage.includes("Không tìm thấy phòng") || errorMessage.includes("Phòng hoặc người dùng không tồn tại")) {
            statusCode = 404;
        } else if (errorMessage.includes("đã có người đặt") || errorMessage.includes("trùng khớp")) {
            statusCode = 409;
        } else if (errorMessage.includes("Yêu cầu đăng nhập")) {
             statusCode = 401;
        }

        return res.status(statusCode).json({
            success: false,
            message: errorMessage
        });
    }
};

// Controller checkAvailability cũng cần cập nhật tương tự
// Controller checkAvailability - ADJUSTED FOR CONSISTENCY
const checkAvailability = async (req, res) => {
    try {
        // Nhận ngày, giờ riêng
        const { room_id, date, start_time, end_time } = req.body;

        // Validation đầu vào cơ bản (giữ nguyên)
        if (!room_id || !date || !start_time || !end_time) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin phòng, ngày hoặc thời gian." });
        }
         if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}(:\d{2})?$/.test(start_time) || !/^\d{2}:\d{2}(:\d{2})?$/.test(end_time)) {
           return res.status(400).json({ success: false, message: "Định dạng ngày (YYYY-MM-DD) hoặc giờ (HH:MM hoặc HH:MM:SS) không hợp lệ." });
       }

        // KHÔNG cần combineDateTime nữa
        // const fullStartTime = combineDateTime(date, start_time);
        // const fullEndTime = combineDateTime(date, end_time);
        // if (!fullStartTime || !fullEndTime) { ... } // Không cần kiểm tra này

        const roomIdNum = parseInt(room_id, 10);
        if (isNaN(roomIdNum)) {
             return res.status(400).json({ success: false, message: "ID phòng không hợp lệ." });
        }

        // Gọi service với dữ liệu RIÊNG BIỆT
        const result = await bookingService.checkBookingTimeSlot(roomIdNum, date, start_time, end_time); // <-- Thay đổi ở đây
        return res.status(200).json({ success: true, available: result.available, message: result.message });

    } catch (error) {
         console.error("Controller Error: Checking availability:", error);
         // Nên trả về lỗi chi tiết hơn nếu có thể
         const errorMessage = error.message || "Lỗi máy chủ khi kiểm tra lịch trống.";
         res.status(500).json({ success: false, available: false, message: errorMessage });
    }
};
 const handleCancelBooking = async (req, res) => {
    // Đặt tên để dễ log lỗi (nếu cần)
    const functionName = 'handleCancelBooking';
    try {
        // 1. Lấy bookingId từ tham số trên URL (ví dụ: /api/bookings/123/cancel)
        const { bookingId } = req.params;

        // 2. Validate dữ liệu đầu vào (Rất quan trọng!)
        if (!bookingId) {
            console.error(`[${functionName}] Lỗi: Thiếu bookingId trong request.`);
            return res.status(400).json({ // 400 Bad Request
                success: false,
                message: "Vui lòng cung cấp Booking ID."
            });
        }

        const bookingIdInt = parseInt(bookingId, 10); // Chuyển sang số nguyên
        if (isNaN(bookingIdInt)) {
            console.error(`[${functionName}] Lỗi: bookingId không phải là số hợp lệ:`, bookingId);
            return res.status(400).json({ // 400 Bad Request
                success: false,
                message: "Booking ID không hợp lệ."
            });
        }

        console.log(`[${functionName}] Nhận yêu cầu hủy booking với ID: ${bookingIdInt}`);

        // 3. Gọi hàm service để thực hiện logic hủy
        // Hàm service sẽ xử lý transaction và trả về message hoặc ném lỗi
        const result = await bookingService.cancelBooking(bookingIdInt);

        // 4. Nếu service thành công (không ném lỗi), gửi phản hồi thành công
        console.log(`[${functionName}] Đã hủy thành công booking ID: ${bookingIdInt}`);
        return res.status(200).json({ // 200 OK
            success: true,
            message: result.message // Lấy thông báo từ service
        });

    } catch (error) {
        // 5. Nếu có lỗi xảy ra trong quá trình xử lý (từ service hoặc lỗi khác)
        console.error(`[${functionName}] Lỗi khi xử lý hủy booking:`, error);

        // Xác định mã trạng thái HTTP phù hợp dựa trên lỗi
        let statusCode = 500; // Mặc định là lỗi server
        const errorMessage = error.message || "Đã xảy ra lỗi không mong muốn khi hủy đặt phòng.";

        // Phân tích các lỗi cụ thể từ service để trả về mã lỗi chính xác hơn
        if (errorMessage.includes("Không tìm thấy đặt phòng") || errorMessage.includes("không tồn tại")) {
            statusCode = 404; // 404 Not Found
        } else if (errorMessage.includes("Không thể hủy") || errorMessage.includes("Chỉ hủy được")) {
            // Lý do nghiệp vụ không cho phép hủy (ví dụ: sai trạng thái)
            statusCode = 400; // 400 Bad Request (hoặc 409 Conflict tùy ngữ cảnh)
        } else if (errorMessage.includes("không hợp lệ")) { // Từ bước validate ở trên
             statusCode = 400; // 400 Bad Request
        }
        // Các lỗi khác (lỗi DB, lỗi transaction...) thường là 500

        return res.status(statusCode).json({
            success: false,
            message: errorMessage
        });
    }
};
const handleBookNow = async (req, res) => {
    const functionName = 'handleBookNow';
    try {
        const mssv = req.user?.mssv;
        if (!mssv) {
            console.error(`[${functionName}] Lỗi: Không tìm thấy thông tin người dùng (MSSV) đã xác thực.`);
            return res.status(401).json({ success: false, message: "Yêu cầu xác thực không hợp lệ." });
        }

        const { roomId, duration_minutes, number_of_attendees } = req.body;

        if (!roomId) {
             return res.status(400).json({ success: false, message: "Vui lòng cung cấp Room ID." });
        }

        console.log(`[${functionName}] User ${mssv} requests to book now room ${roomId}`);

        const result = await bookingService.bookNow({
            roomId,
            mssv,
            duration_minutes,
            number_of_attendees
        });

        return res.status(200).json({
            success: true,
            message: result.message,
            data: {
                bookingId: result.bookingId,
                startTime: result.startTime,
                endTime: result.endTime,
                date: result.date
            }
        });

    } catch (error) {
        console.error(`[${functionName}] Controller Error:`, error);
        let statusCode = 500;
        const errorMessage = error.message || "Lỗi không xác định khi đặt phòng ngay.";

        if (errorMessage.includes("không hợp lệ") || errorMessage.includes("Thiếu thông tin")) {
            statusCode = 400;
        } else if (errorMessage.includes("Không tìm thấy phòng")) {
            statusCode = 404;
        } else if (errorMessage.includes("không trống") || errorMessage.includes("Không đủ chỗ") || errorMessage.includes("đã có lịch đặt khác")) {
            statusCode = 409;
        }

        return res.status(statusCode).json({
            success: false,
            message: errorMessage
        });
    }
};
const getStudentBookings = async (req, res) => {
    try {
        const mssv = req.params.mssv; // Lấy mssv từ URL parameter

        if (!mssv) {
            return res.status(400).json({
                EM: 'Thiếu tham số MSSV.', // Error Message
                EC: '-1',                // Error Code
                DT: ''                   // Data
            });
        }

        const bookings = await bookingService.getBookingsByMssv(mssv);

        // Nếu không có booking nào, vẫn trả về mảng rỗng (thành công)
        return res.status(200).json({
            EM: `Lấy danh sách đặt chỗ cho MSSV ${mssv} thành công.`,
            EC: '0',
            DT: bookings // Dữ liệu là mảng các booking
        });

    } catch (error) {
        console.error("API Error getting student bookings:", error);
        return res.status(500).json({
            EM: 'Lỗi máy chủ khi lấy danh sách đặt chỗ.',
            EC: '-1',
            DT: error.message // Có thể gửi message lỗi chi tiết hơn trong môi trường dev
        });
    }
};
const handleCheckIn = async (req, res) => {
    const functionName = 'handleCheckIn';
    try {
        const mssv = req.user?.mssv;
        if (!mssv) return res.status(401).json({ success: false, message: "Yêu cầu xác thực không hợp lệ hoặc thiếu MSSV." });
        const { bookingId } = req.params;
        const { roomId } = req.body;
        if (!bookingId) return res.status(400).json({ success: false, message: "Thiếu Booking ID trong URL." });
        const bookingIdInt = parseInt(bookingId, 10);
        if (isNaN(bookingIdInt)) return res.status(400).json({ success: false, message: "Booking ID không hợp lệ." });
        const roomIdInt = roomId ? parseInt(roomId, 10) : null;
        if (roomId && isNaN(roomIdInt)) return res.status(400).json({ success: false, message: "Room ID không hợp lệ." });
        const result = await bookingService.checkInBooking(bookingIdInt, mssv, roomIdInt);
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        let statusCode = 500;
        const errorMessage = error.message || "Lỗi không xác định khi check-in.";
        if (errorMessage.includes("không hợp lệ") || errorMessage.includes("là bắt buộc")) statusCode = 400;
        else if (errorMessage.includes("không có quyền")) statusCode = 403;
        else if (errorMessage.includes("Không tìm thấy đặt phòng")) statusCode = 404;
        else if (errorMessage.includes("không đúng phòng") || errorMessage.includes("Chỉ có thể check-in khi đặt phòng")) statusCode = 409;
        else if (errorMessage.includes("Yêu cầu xác thực")) statusCode = 401;
        return res.status(statusCode).json({ success: false, message: errorMessage });
    }
};

const handleCheckOut = async (req, res) => {
    const functionName = 'handleCheckOut';
     try {
        const mssv = req.user?.mssv;
        if (!mssv) return res.status(401).json({ success: false, message: "Yêu cầu xác thực không hợp lệ hoặc thiếu MSSV." });
        const { bookingId } = req.params;
        if (!bookingId) return res.status(400).json({ success: false, message: "Thiếu Booking ID trong URL." });
        const bookingIdInt = parseInt(bookingId, 10);
        if (isNaN(bookingIdInt)) return res.status(400).json({ success: false, message: "Booking ID không hợp lệ." });
        const result = await bookingService.checkOutBooking(bookingIdInt, mssv);
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        let statusCode = 500;
        const errorMessage = error.message || "Lỗi không xác định khi check-out.";
        if (errorMessage.includes("không hợp lệ") || errorMessage.includes("là bắt buộc")) statusCode = 400;
        else if (errorMessage.includes("không có quyền")) statusCode = 403;
        else if (errorMessage.includes("Không tìm thấy đặt phòng")) statusCode = 404;
        else if (errorMessage.includes("Chỉ có thể check-out khi đặt phòng")) statusCode = 409;
        else if (errorMessage.includes("Yêu cầu xác thực")) statusCode = 401;
        return res.status(statusCode).json({ success: false, message: errorMessage });
    }
};

const updateBooking = async (req, res) => {
    const functionName = 'updateBooking';
    try {
        const mssv = req.user?.mssv; // Lấy từ token đã xác thực
        if (!mssv) {
            return res.status(401).json({ success: false, message: "Yêu cầu xác thực không hợp lệ hoặc thiếu MSSV." });
        }

        const { bookingId } = req.params;
        const updateData = req.body; // Dữ liệu cần cập nhật từ client

        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Thiếu Booking ID trong URL." });
        }
        const bookingIdInt = parseInt(bookingId, 10);
        if (isNaN(bookingIdInt)) {
             return res.status(400).json({ success: false, message: "Booking ID không hợp lệ." });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: "Không có dữ liệu nào được cung cấp để cập nhật." });
        }

        // (Tùy chọn) Validate các trường trong updateData ở đây nếu cần trước khi gửi vào service

        console.log(`[${functionName}] User ${mssv} attempting update for booking ${bookingIdInt} with data:`, updateData);

        const result = await bookingService.updateBookingDetails(bookingIdInt, mssv, updateData);

        return res.status(200).json({
            success: true,
            message: result.message,
            updatedFields: result.updatedFields // Trả về các trường đã được cập nhật
        });

    } catch (error) {
        console.error(`[${functionName}] Controller Error:`, error);
        let statusCode = 500;
        const errorMessage = error.message || "Lỗi không xác định khi cập nhật đặt phòng.";

        // Phân loại lỗi từ service để trả về status code phù hợp
        if (errorMessage.includes("không hợp lệ") || errorMessage.includes("Thiếu thông tin") || errorMessage.includes("Không có thông tin")) {
             statusCode = 400;
        } else if (errorMessage.includes("không có quyền")) {
            statusCode = 403; // Forbidden
        } else if (errorMessage.includes("Không tìm thấy")) {
            statusCode = 404; // Not Found
        } else if (errorMessage.includes("Không thể sửa đổi") || errorMessage.includes("bị trùng lịch") || errorMessage.includes("Không đủ chỗ trống")) {
            statusCode = 409; // Conflict
        } else if (errorMessage.includes("Yêu cầu xác thực")) {
             statusCode = 401; // Unauthorized
        }

        return res.status(statusCode).json({
            success: false,
            message: errorMessage
        });
    }
};
const getBookingDetails = async (req, res) => {
    const functionName = 'getBookingDetails';
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({
                EM: 'Thiếu Booking ID trong URL.', EC: '-1', DT: '' });
        }
        const bookingIdInt = parseInt(bookingId, 10);
        if (isNaN(bookingIdInt)) {
             return res.status(400).json({
                EM: 'Booking ID không hợp lệ.', EC: '-1', DT: '' });
        }

        // Gọi service để lấy chi tiết booking
        const bookingDetails = await bookingService.getBookingDetailsById(bookingIdInt);

        // Kiểm tra nếu không tìm thấy booking
        if (!bookingDetails) {
            return res.status(404).json({
                EM: `Không tìm thấy đặt phòng với ID: ${bookingIdInt}.`, EC: '-1', DT: null });
        }
        return res.status(200).json({
            EM: `Thôn tin ${bookingIdInt} thành công.`,
            EC: '0',
            DT: bookingDetails 
        });

    } catch (error) {
        console.error(`[${functionName}] Controller Error:`, error);
        return res.status(500).json({
            EM: 'Lỗi máy chủ khi lấy chi tiết đặt phòng.',
            EC: '-1',
            DT: error.message
        });
    }
};

export default {
    createBooking,
    checkAvailability,
    handleCancelBooking,
    handleBookNow,
    getStudentBookings,
    handleCheckOut,
    handleCheckIn,
    updateBooking,
    getBookingDetails
};