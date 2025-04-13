const express = require('express');
const router = express.Router();
const connection = require('../config/connectDB'); 
const bcrypt = require('bcryptjs');


const checkLoginCredentials = async (username, password) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Users WHERE mssv = ? OR email = ?';
        console.log("Executing query:", query, "with values:", [username, username]); // Log truy vấn SQL
        connection.query(query, [username, username], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return reject({ status: 500, message: 'Internal server error' });
            }

            console.log("Query results:", results); // Log kết quả truy vấn

            if (results.length === 0) {
                console.log("No user found with username:", username); // Log khi không tìm thấy user
                return reject({ status: 401, message: 'Invalid username or password' });
            }

            const user = results[0];
            console.log("User found:", user); // Log thông tin user lấy được từ DB

            // Kiểm tra nếu `user.Pass` không tồn tại
            if (!user.Pass) { // Sửa từ `user.pass` thành `user.Pass`
                console.log("Password field is missing for user:", username); // Log khi không có mật khẩu
                return reject({ status: 401, message: 'Invalid username or password' });
            }

            try {
                // So sánh mật khẩu với mật khẩu đã mã hóa trong database
                console.log("Comparing passwords..."); // Log trước khi so sánh mật khẩu
                const isPasswordValid = await bcrypt.compare(password, user.Pass); // Sửa từ `user.pass` thành `user.Pass`
                console.log("Password comparison result:", isPasswordValid); // Log kết quả so sánh mật khẩu mã hóa
                if (isPasswordValid) {
                    console.log("Password is valid for user:", username); // Log khi mật khẩu hợp lệ
                    return resolve({
                        mssv: user.mssv,
                        fullName: user.FullName, // Sửa từ `user.fullName` thành `user.FullName`
                        email: user.Email, // Sửa từ `user.email` thành `user.Email`
                        role: user.Role // Sửa từ `user.role` thành `user.Role`
                    });
                }

                // Nếu mật khẩu không khớp với mã hóa, kiểm tra mật khẩu dạng không mã hóa
                console.log("Checking plain text password..."); // Log trước khi kiểm tra mật khẩu không mã hóa
                if (password === user.Pass) { // Sửa từ `user.pass` thành `user.Pass`
                    console.log("Plain text password is valid for user:", username); // Log khi mật khẩu không mã hóa hợp lệ
                    return resolve({
                        mssv: user.mssv,
                        fullName: user.FullName, // Sửa từ `user.fullName` thành `user.FullName`
                        email: user.Email, // Sửa từ `user.email` thành `user.Email`
                        role: user.Role // Sửa từ `user.role` thành `user.Role`
                    });
                }

                // Nếu cả hai kiểm tra đều thất bại
                console.log("Both hashed and plain text password checks failed for user:", username);
                return reject({ status: 401, message: 'Invalid username or password' });
            } catch (error) {
                console.error('Error comparing passwords:', error);
                return reject({ status: 500, message: 'Internal server error' });
            }
        });
    });
};

module.exports = {
    checkLoginCredentials 
};