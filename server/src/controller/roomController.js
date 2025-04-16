import roomService from "../service/roomService"; // Đảm bảo đường dẫn đúng

/**
 * Controller để tạo phòng mới (thường từ form submission).
 * Nhận dữ liệu từ req.body, gọi service và redirect hoặc gửi lỗi.
 */
const createRoom = async (req, res) => {
    try {
        // 1. Nhận dữ liệu từ req.body (bao gồm cả các trường mới)
        const roomData = {
            capacity: parseInt(req.body.capacity, 10), // Chuyển sang số
            location: req.body.location,
            room_status: req.body.room_status || 'Available',
            devices: req.body.devices, // Chuỗi hoặc undefined/null
            // Nhận trường mới, chuyển đổi 'available_seats' sang số
            // Nếu available_seats trống, service sẽ tự đặt bằng capacity
            available_seats: req.body.available_seats ? parseInt(req.body.available_seats, 10) : undefined,
            room_type: req.body.room_type // 'single' hoặc 'group'
        };

        console.log("BE Controller: Received data for new room:", roomData);

        // 2. Validation cơ bản ở Controller (Service cũng có validation chi tiết hơn)
        if (isNaN(roomData.capacity) || roomData.capacity <= 0) {
             throw new Error("Sức chứa không hợp lệ.");
        }
         if (roomData.available_seats !== undefined && isNaN(roomData.available_seats)) {
              throw new Error("Số chỗ trống phải là một số.");
         }
         // Service sẽ validate tiếp room_type, status, location, etc.


        // 3. Gọi Service
        const result = await roomService.addRoom(roomData);
        console.log("BE Controller: Room added successfully:", result);

        // 4. Redirect sau khi thành công (phù hợp với luồng form submission)
        // Nếu muốn gửi JSON thì thay bằng: res.status(201).json({ success: true, ...result });
        // Cân nhắc dùng connect-flash để gửi thông báo thành công qua redirect
        // req.flash('success', result.message);
        res.redirect("/home"); // Hoặc trang danh sách phòng

    } catch (error) {
        // 5. Xử lý lỗi
        console.error("BE Controller: Error creating room:", error);
        // Thay vì gửi JSON, gửi thông báo lỗi hoặc redirect về form với lỗi
        // Nếu dùng connect-flash:
        // req.flash('error', error.message || "Lỗi xảy ra khi tạo phòng.");
        // res.redirect('/page-with-add-form'); // Redirect về trang có form
        // Hoặc hiển thị trang lỗi đơn giản:
        res.status(400).send(`
            <html><body>
                <h2>Lỗi khi tạo phòng</h2>
                <p>${error.message || "Đã có lỗi xảy ra."}</p>
                <a href="/home">Quay lại trang chủ</a>
                <script>setTimeout(() => window.history.back(), 3000);</script> <%# Tự động quay lại sau 3s %>
            </body></html>
        `);
    }
};

/**
 * Controller để lấy danh sách tất cả phòng (thường dùng cho API).
 * Trả về dữ liệu JSON.
 */
const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomService.getRoomList(); // Service đã được cập nhật
        res.status(200).json({ success: true, data: rooms }); // Luôn trả về cấu trúc nhất quán
    } catch (error) {
        console.error("BE Controller: Error fetching all rooms:", error);
        res.status(500).json({ success: false, message: error.message || "Lỗi lấy danh sách phòng." });
    }
};

/**
 * Controller để lấy chi tiết một phòng (thường dùng cho API).
 * Trả về dữ liệu JSON.
 */
const getRoom = async (req, res) => {
    try {
        const roomId = parseInt(req.params.id, 10); // Lấy ID từ URL và chuyển sang số
        if (isNaN(roomId)) {
             return res.status(400).json({ success: false, message: "ID phòng không hợp lệ." });
        }
        const room = await roomService.getRoomById(roomId); // Service đã được cập nhật
        if (!room) {
            return res.status(404).json({ success: false, message: "Không tìm thấy phòng" });
        }
        res.status(200).json({ success: true, data: room });
    } catch (error) {
        console.error("BE Controller: Error fetching room details:", error);
        res.status(500).json({ success: false, message: error.message || "Lỗi lấy chi tiết phòng." });
    }
};

/**
 * Controller để cập nhật phòng (thường từ form submission).
 * Nhận dữ liệu từ req.body, gọi service và redirect hoặc gửi lỗi.
 */
const editRoom = async (req, res) => {
    try {
      const roomId = parseInt(req.body.room_id, 10); // Lấy ID từ body và chuyển sang số
       if (isNaN(roomId)) {
             throw new Error("ID phòng không hợp lệ để cập nhật.");
       }

      // 1. Tạo đối tượng chứa dữ liệu cập nhật từ form
      const updatedRoomData = {
        capacity: req.body.capacity ? parseInt(req.body.capacity, 10) : undefined,
        location: req.body.location || undefined, // Giữ lại nếu có, undefined nếu rỗng
        status: req.body.room_status || undefined,
        // devices: req.body.devices, // Cập nhật devices phức tạp, tạm thời bỏ qua ở đây
        available_seats: req.body.available_seats !== undefined && req.body.available_seats !== ''
                         ? parseInt(req.body.available_seats, 10)
                         : undefined, // undefined nếu trống
        room_type: req.body.room_type || undefined
      };

        console.log(`BE Controller: Received update data for room ${roomId}:`, updatedRoomData);

      // 2. Loại bỏ các trường không có giá trị (undefined) để service không cập nhật chúng
      Object.keys(updatedRoomData).forEach(key => updatedRoomData[key] === undefined && delete updatedRoomData[key]);

       // 3. Kiểm tra xem có dữ liệu thực sự để cập nhật không
       if (Object.keys(updatedRoomData).length === 0) {
             console.log(`BE Controller: No valid fields to update for room ${roomId}.`);
             // req.flash('info', 'Không có thông tin nào được thay đổi.');
             return res.redirect("/home"); // Không có gì để làm, quay về home
       }

       // 4. Validation các giá trị số sau khi parse
       if (updatedRoomData.capacity !== undefined && isNaN(updatedRoomData.capacity)) throw new Error("Sức chứa không hợp lệ.");
       if (updatedRoomData.available_seats !== undefined && isNaN(updatedRoomData.available_seats)) throw new Error("Số chỗ trống không hợp lệ.");


      // 5. Gọi Service (Service đã được cập nhật để chỉ update các trường được cung cấp)
      const updatedRoom = await roomService.updateRoom(roomId, updatedRoomData);

      if (!updatedRoom) {
         // Service trả về null nếu phòng không tồn tại
         throw new Error("Không tìm thấy phòng để cập nhật.");
      }
      console.log(`BE Controller: Room ${roomId} updated successfully.`);

      // 6. Redirect sau khi thành công
      // req.flash('success', 'Cập nhật phòng thành công!');
      res.redirect("/home");

    } catch (error) {
      // 7. Xử lý lỗi
      console.error(`BE Controller: Error updating room ${req.body.room_id}:`, error);
      // req.flash('error', error.message || "Lỗi khi cập nhật phòng.");
      // res.redirect('/home'); // Hoặc redirect về trang edit
        res.status(400).send(`
            <html><body>
                <h2>Lỗi khi cập nhật phòng</h2>
                <p>${error.message || "Đã có lỗi xảy ra."}</p>
                <a href="/home">Quay lại trang chủ</a>
                <script>setTimeout(() => window.history.back(), 3000);</script>
            </body></html>
        `);
    }
  };


/**
 * Controller để khóa phòng (chuyển status sang Maintenance - thường từ form/button).
 * Nhận ID từ URL params, gọi service và redirect hoặc gửi lỗi.
 */
const lockRoom = async (req, res) => {
    try {
        const roomId = parseInt(req.params.id, 10); // Lấy ID từ URL
         if (isNaN(roomId)) {
             throw new Error("ID phòng không hợp lệ để khóa.");
         }

        // Gọi service (service trả về true nếu thành công, false nếu không tìm thấy/đã khóa)
        const lockSuccess = await roomService.lockRoom(roomId);

        if (!lockSuccess) {
             // req.flash('warning', `Không thể khóa phòng ${roomId}. Phòng không tồn tại hoặc đã ở trạng thái bảo trì.`);
            // Thay vì lỗi 404 JSON, thông báo và redirect
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
        // req.flash('success', `Phòng ${roomId} đã được chuyển sang trạng thái Bảo trì.`);
        res.redirect("/home"); // Redirect thành công

    } catch (error) {
        console.error(`BE Controller: Error locking room ${req.params.id}:`, error);
        // req.flash('error', error.message || "Lỗi xảy ra khi khóa phòng.");
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

/**
 * Controller để lấy danh sách phòng trống (thường dùng cho API).
 * Trả về dữ liệu JSON.
 */
const listAvailableRooms = async (req, res) => {
    try {
        const availableRooms = await roomService.getAvailableRooms(); // Service đã được cập nhật
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
            error: error.message || "Unknown error" // Cung cấp thông tin lỗi rõ ràng hơn
        });
    }
};

// Export tất cả các hàm controller
export default {
    createRoom,         // Xử lý form POST -> Redirect
    getAllRooms,        // API -> JSON
    getRoom,            // API -> JSON
    editRoom,           // Xử lý form POST -> Redirect
    lockRoom,           // Xử lý form POST -> Redirect
    listAvailableRooms  // API -> JSON
};