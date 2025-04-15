import { checkLoginCredentials, updateStatusOffline } from "../service/loginService.js";
import jwt from "jsonwebtoken";

// API Login
const handleLoginapi = async (req, res) => {
    const { username, password } = req.body;
    console.log("Request body:", req.body);

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const user = await checkLoginCredentials(username, password);
        
        // Tạo access token
        const access_token = jwt.sign(
            { mssv: user.mssv, role: user.role }, 
            "your_secret_key",                  
            { expiresIn: "1h" }                 
        );

        // Lưu session (Nếu muốn dùng session thay vì token)
        req.session.userId = user.mssv; 

        return res.status(200).json({
            message: "Login successful",
            access_token,
            token_type: "Bearer",
            expires_in: 3600,
            user: user
        });

    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// API Logout
const logoutUser = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Kiểm tra token từ header
    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }

    jwt.verify(token, "your_secret_key", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        const mssv = decoded.mssv; // Lấy mssv từ token
        updateStatusOffline(mssv); // Cập nhật trạng thái Offline

        // Hủy session (Nếu dùng session)
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Internal server error');
            }
            res.clearCookie('connect.sid');  // Xóa cookie session
            res.status(200).json({ message: "Logout successful" });  // Thành công
        });
    });
};

// API Test
const testapi = (req, res) => {
    return res.status(200).json({
        message: "API is working",
        data: "Test API"
    });
};

// API Register
const handleRegister = (req, res) => {
    return res.status(200).json({ message: "Register endpoint" });
};

export default {
    handleLoginapi,
    testapi,
    handleRegister,
    logoutUser
};
