const express = require('express');
const router = express.Router();
const connection = require('../config/connectDB'); 
const bcrypt = require('bcryptjs');

//  Online 
const updateStatusOnline = (mssv) => {
    const updateQuery = 'UPDATE Users SET Status = ? WHERE mssv = ?';
    connection.query(updateQuery, ['Online', mssv], (err, result) => {
        if (err) {
            console.error("Failed to update status to Online for user:", mssv, err);
        } else {
            console.log("User status updated to Online for mssv:", mssv);
        }
    });
};
// Offline 
const updateStatusOffline = (mssv) => {
    const updateQuery = 'UPDATE Users SET Status = ? WHERE mssv = ?';
    connection.query(updateQuery, ['Offline', mssv], (err, result) => {
        if (err) {
            console.error("Failed to update status to Offline for user:", mssv, err);
        } else {
            console.log("User status updated to Offline for mssv:", mssv);
        }
    });
};

// đăng nhập
const checkLoginCredentials = async (username, password) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Users WHERE mssv = ? OR email = ?';
        console.log("Executing query:", query, "with values:", [username, username]);

        connection.query(query, [username, username], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return reject({ status: 500, message: 'Internal server error' });
            }

            console.log("Query results:", results);

            if (results.length === 0) {
                console.log("No user found with username:", username);
                return reject({ status: 401, message: 'Invalid username or password' });
            }

            const user = results[0];
            console.log("User found:", user);

            if (!user.Pass) {
                console.log("Password field is missing for user:", username);
                return reject({ status: 401, message: 'Invalid username or password' });
            }

            try {
                const isPasswordValid = await bcrypt.compare(password, user.Pass);
                console.log("Password comparison result:", isPasswordValid);

                if (isPasswordValid) {
                    console.log("Password is valid for user:", username);

                    // Cập nhật trạng thái Online
                    updateStatusOnline(user.mssv);

                    return resolve({
                        mssv: user.mssv,
                        fullName: user.FullName,
                        email: user.Email,
                        role: user.Role
                    });
                }

                // Trường hợp mật khẩu chưa mã hóa (kiểm tra plain text)
                console.log("Checking plain text password...");
                if (password === user.Pass) {
                    console.log("Plain text password is valid for user:", username);

                    // Cập nhật trạng thái Online
                    updateStatusOnline(user.mssv);

                    return resolve({
                        mssv: user.mssv,
                        fullName: user.FullName,
                        email: user.Email,
                        role: user.Role
                    });
                }

                // Nếu không khớp
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
    checkLoginCredentials,
    updateStatusOffline
};
