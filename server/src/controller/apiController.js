import { checkLoginCredentials } from "../service/loginService.js";

const handleLoginapi = async (req, res) => {
    const { username, password } = req.body;
    console.log("Request body:", req.body);
    // Kiểm tra đầu vào
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Gọi hàm kiểm tra thông tin đăng nhập từ loginService
        const user = await checkLoginCredentials(username, password);
        return res.status(200).json({
            message: "Login successful",
            user: user
        });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

const testapi = (req, res) => {
    return res.status(200).json({
        message: "API is working",
        data: "Test API"
    });
};

const handleRegister = (req, res) => {
    // Logic xử lý đăng ký (nếu cần)
    return res.status(200).json({ message: "Register endpoint" });
};

export default {
    handleLoginapi,
    testapi,
    handleRegister
};