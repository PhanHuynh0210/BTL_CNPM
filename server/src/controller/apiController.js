import { checkLoginCredentials } from "../service/loginService.js";

const jwt = require("jsonwebtoken");

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


const testapi = (req, res) => {
    return res.status(200).json({
        message: "API is working",
        data: "Test API"
    });
};

const handleRegister = (req, res) => {
    return res.status(200).json({ message: "Register endpoint" });
};

export default {
    handleLoginapi,
    testapi,
    handleRegister
};