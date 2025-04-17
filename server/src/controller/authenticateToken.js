import jwt from 'jsonwebtoken';

const JWT_SECRET = "your_secret_key";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (token == null) {
        // Không tìm thấy token
        return res.status(401).json({ success: false, message: 'Yêu cầu xác thực. Vui lòng đăng nhập.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
        if (err) {
            console.error("Auth Middleware: Token verification failed:", err.message);
            if (err.name === 'TokenExpiredError') {
                 return res.status(401).json({ success: false, message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
            }
            return res.status(403).json({ success: false, message: 'Token không hợp lệ hoặc bị từ chối.' });
        }

        req.user = decodedPayload;
        next(); 
    });
};

export default authenticateToken;