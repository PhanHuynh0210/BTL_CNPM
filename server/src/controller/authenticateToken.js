import jwt from 'jsonwebtoken';

const JWT_SECRET = "your_secret_key";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (token == null) {
        // Không tìm thấy token
        return res.status(401).json({ success: false, message: 'Yêu cầu xác thực. Vui lòng đăng nhập.' });
    }

    // Xác minh token bằng khóa bí mật đã định nghĩa ở trên
    jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
        if (err) {
            // Xử lý lỗi xác minh
            console.error("Auth Middleware: Token verification failed:", err.message);
            if (err.name === 'TokenExpiredError') {
                 return res.status(401).json({ success: false, message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
            }
            // Lỗi khác (vd: chữ ký sai do key không khớp) -> 403 Forbidden
            return res.status(403).json({ success: false, message: 'Token không hợp lệ hoặc bị từ chối.' });
        }

        // Token hợp lệ, gắn payload (chứa mssv, role) vào req.user
        req.user = decodedPayload;
        next(); // Cho phép đi tiếp
    });
};

export default authenticateToken;