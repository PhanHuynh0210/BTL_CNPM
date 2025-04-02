-- Tạo cơ sở dữ liệu
CREATE DATABASE BTL_CNPM;
USE BTL_CNPM;

-- Bảng Users: Lưu thông tin người dùng
CREATE TABLE Users (
    mssv VARCHAR(20) PRIMARY KEY, -- Mã số sinh viên làm khóa chính
    FullName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Pass VARCHAR(255) NOT NULL,
    Phone VARCHAR(20) UNIQUE,
    Sex ENUM('M', 'F', 'Other'),
    Role ENUM('Admin_IT', 'Student', 'School', 'Admin_IOT') NOT NULL
);

-- Bảng Support: Lưu yêu cầu hỗ trợ và thông tin liên hệ của trường
CREATE TABLE Support (
    support_id INT PRIMARY KEY AUTO_INCREMENT,
    mssv VARCHAR(20), -- Tham chiếu mssv từ bảng Users
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment TEXT NOT NULL,
    FOREIGN KEY (mssv) REFERENCES Users(mssv) ON DELETE CASCADE
);

-- Bảng Rooms: Lưu thông tin các phòng học
CREATE TABLE Rooms (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    capacity INT NOT NULL CHECK (capacity > 0),
    location VARCHAR(255) NOT NULL,
    status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available',
    qr_code VARCHAR(255) UNIQUE
);

-- Bảng Bookings: Quản lý việc đặt phòng
CREATE TABLE Bookings (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT NOT NULL,
    mssv VARCHAR(20) NOT NULL, -- Tham chiếu mssv từ bảng Users
    Day DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (room_id) REFERENCES Rooms(ID) ON DELETE CASCADE,
    FOREIGN KEY (mssv) REFERENCES Users(mssv) ON DELETE CASCADE,
    CHECK (start_time < end_time)
);

-- Bảng CheckInOut: Quản lý check-in/check-out của người dùng
CREATE TABLE CheckInOut (
    check_id INT PRIMARY KEY AUTO_INCREMENT,
    mssv VARCHAR(20) NOT NULL, -- Tham chiếu mssv từ bảng Users
    book_id INT NOT NULL,
    time_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_out TIMESTAMP NULL,
    status_check ENUM('Not-checked-in', 'Checked-in') DEFAULT 'Not-checked-in',
    FOREIGN KEY (mssv) REFERENCES Users(mssv) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES Bookings(ID) ON DELETE CASCADE
);

-- Bảng Devices: Quản lý thiết bị trong phòng
CREATE TABLE Devices (
    device_id INT PRIMARY KEY AUTO_INCREMENT,
    device_name VARCHAR(255) NOT NULL,
    status ENUM('Active', 'Inactive', 'Maintenance') DEFAULT 'Active',
    room_id INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES Rooms(ID) ON DELETE CASCADE
);

-- Bảng Feedbacks: Lưu phản hồi của người dùng
CREATE TABLE Feedbacks (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    mssv VARCHAR(20) NOT NULL, -- Tham chiếu mssv từ bảng Users
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mssv) REFERENCES Users(mssv) ON DELETE CASCADE
);

-- Chèn dữ liệu vào bảng Users
INSERT INTO Users (mssv, FullName, Email, Pass, Phone, Sex, Role) VALUES
('IT001', 'Nguyễn Văn A', 'admin_it@hcmut.edu.vn', 'admin123', '0123456789', 'M', 'Admin_IT'),
('IOT001', 'Trần Thị B', 'admin_iot@hcmut.edu.vn', 'iotadmin123', '0987654321', 'F', 'Admin_IOT'),
('22XXXXX', 'Lê Văn C', 'student1@hcmut.edu.vn', 'student123', '0345678912', 'M', 'Student'),
('23XXXXX', 'Phạm Thị D', 'student2@hcmut.edu.vn', 'student456', '0356789123', 'F', 'Student'),
('24XXXXX', 'Đỗ Văn E', 'school@hcmut.edu.vn', 'school123', '0367891234', 'M', 'School');

-- Chèn thông tin liên hệ của trường vào bảng Support
INSERT INTO Support (mssv, comment) VALUES
(NULL, 'School Contact - Email: contact@hcmut.edu.vn, Phone: 028-38647256');

-- Chèn dữ liệu vào bảng Rooms
INSERT INTO Rooms (capacity, location, status, qr_code) VALUES
(10, 'Tòa nhà A1 - Phòng 101', 'Available', 'QR101'),
(20, 'Tòa nhà A1 - Phòng 102', 'Occupied', 'QR102'),
(15, 'Tòa nhà A2 - Phòng 201', 'Maintenance', 'QR201'),
(25, 'Tòa nhà A2 - Phòng 202', 'Available', 'QR202');

-- Chèn dữ liệu vào bảng Bookings
INSERT INTO Bookings (room_id, mssv, Day, start_time, end_time, status) VALUES
(1, '22XXXXX', '2025-04-05', '08:00:00', '10:00:00', 'Confirmed'),
(2, '23XXXXX', '2025-04-06', '09:00:00', '11:00:00', 'Pending'),
(3, '22XXXXX', '2025-04-07', '13:00:00', '15:00:00', 'Cancelled'),
(4, '23XXXXX', '2025-04-08', '14:00:00', '16:00:00', 'Confirmed');

-- Chèn dữ liệu vào bảng CheckInOut
INSERT INTO CheckInOut (mssv, book_id, time_in, time_out, status_check) VALUES
('22XXXXX', 1, '2025-04-05 08:05:00', NULL, 'Checked-in'),
('23XXXXX', 2, NULL, NULL, 'Not-checked-in'),
('22XXXXX', 3, '2025-04-07 13:10:00', '2025-04-07 15:00:00', 'Checked-in'),
('23XXXXX', 4, '2025-04-08 14:05:00', '2025-04-08 16:00:00', 'Checked-in');

-- Chèn dữ liệu vào bảng Devices
INSERT INTO Devices (device_name, status, room_id) VALUES
('Máy chiếu', 'Active', 1),
('Điều hòa', 'Active', 2),
('Máy tính', 'Maintenance', 3),
('Quạt trần', 'Inactive', 4);

-- Chèn dữ liệu vào bảng Feedbacks
INSERT INTO Feedbacks (mssv, rating, comment) VALUES
('22XXXXX', 5, 'Phòng học rộng rãi, thoáng mát.'),
('23XXXXX', 4, 'Thiết bị hoạt động tốt nhưng cần bảo trì thêm.'),
('22XXXXX', 3, 'Phòng hơi chật khi học nhóm.'),
('23XXXXX', 2, 'Thiếu điều hòa, hơi nóng.');
