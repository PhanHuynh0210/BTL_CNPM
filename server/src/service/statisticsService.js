// src/service/statisticsService.js
import connection from "../config/connectDB"; 

// Hàm lấy số lượng phòng theo từng trạng thái
const getRoomCounts = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT
                COUNT(*) AS totalRooms,
                SUM(CASE WHEN status = 'Occupied' THEN 1 ELSE 0 END) AS occupiedRooms,
                SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) AS availableRooms,
                SUM(CASE WHEN status = 'Maintenance' THEN 1 ELSE 0 END) AS maintenanceRooms
            FROM Rooms;
        `;
        connection.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching room counts:", err);
                return reject(new Error("Lỗi truy vấn số lượng phòng."));
            }
            resolve(results.length > 0 ? results[0] : { totalRooms: 0, occupiedRooms: 0, availableRooms: 0, maintenanceRooms: 0 });
        });
    });
};

// Hàm lấy số lượng yêu cầu hỗ trợ đang chờ xử lý
const getPendingSupportCount = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS pendingSupportRequests FROM Support WHERE status = 'Pending';`;
        connection.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching pending support count:", err);
                return reject(new Error("Lỗi truy vấn số lượng yêu cầu hỗ trợ."));
            }
            resolve(results.length > 0 ? results[0].pendingSupportRequests : 0);
        });
    });
};

// Hàm lấy điểm đánh giá trung bình
const getAverageFeedbackRating = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT AVG(rating) AS averageRating FROM Feedbacks;`;
        connection.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching average feedback rating:", err);
                return reject(new Error("Lỗi truy vấn đánh giá trung bình."));
            }

            let avgRating = null; 

            if (results.length > 0 && results[0].averageRating !== null) {
                avgRating = parseFloat(results[0].averageRating);
                if (isNaN(avgRating)) {
                    console.warn("Could not parse averageRating to float:", results[0].averageRating);
                    avgRating = null; 
                }
            }

            console.log("--- DEBUG [Service]: Average Rating (after parseFloat) ---");
            console.log("Value:", avgRating);
            console.log("Type:", typeof avgRating);
            // -------------------------------------------------------
            resolve(avgRating); 
        });
    });
};

// Hàm tổng hợp tất cả các thống kê cho dashboard
const getDashboardStats = async () => {
    try {
        const [roomCounts, pendingSupportRequests, averageRating] = await Promise.all([
            getRoomCounts(),
            getPendingSupportCount(),
            getAverageFeedbackRating()
        ]);

        const stats = {
            totalRooms: parseInt(roomCounts.totalRooms, 10) || 0,
            occupiedRooms: parseInt(roomCounts.occupiedRooms, 10) || 0,
            availableRooms: parseInt(roomCounts.availableRooms, 10) || 0,
            maintenanceRooms: parseInt(roomCounts.maintenanceRooms, 10) || 0,
            pendingSupportRequests: parseInt(pendingSupportRequests, 10) || 0,
            averageRating: averageRating
        };

        return stats;

    } catch (error) {
        console.error("Error aggregating dashboard stats:", error);
        throw new Error("Không thể lấy dữ liệu thống kê cho dashboard.");
    }
};


module.exports = {
    getDashboardStats
};