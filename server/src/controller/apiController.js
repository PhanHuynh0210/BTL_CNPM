import { checkLoginCredentials, updateStatusOffline } from "../service/loginService.js";
import userService from "../service/userService.js"
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
const getCurrentUserProfile = async (req, res) => {
    try {
        // Middleware authenticateToken đã xác thực và gắn thông tin user vào req.user
        const mssv = req.user?.mssv;

        if (!mssv) {
            // Trường hợp này không nên xảy ra nếu middleware hoạt động đúng
            console.error("Error in getCurrentUserProfile: Missing mssv in req.user after authentication.");
            return res.status(401).json({ success: false, message: "Thông tin xác thực không hợp lệ." });
        }

        // Gọi service để lấy thông tin user (không lấy mật khẩu)
        const userProfile = await userService.findUserByMSSV(mssv);

        if (!userProfile) {
            // User có token hợp lệ nhưng không tìm thấy trong DB? (Trường hợp lạ)
            console.error(`Error in getCurrentUserProfile: User with mssv ${mssv} not found in DB despite valid token.`);
            return res.status(404).json({ success: false, message: "Không tìm thấy thông tin người dùng." });
        }

        // Trả về thông tin user
        return res.status(200).json({
            success: true,
            message: "Lấy thông tin người dùng thành công.",
            data: userProfile
        });

    } catch (error) {
        console.error("Controller Error: Getting current user profile:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi lấy thông tin người dùng."
        });
    }
};
export default {
    handleLoginapi,
    testapi,
    handleRegister,
    logoutUser,
    getCurrentUserProfile
};
