import connection from "../config/connectDB";

const getSupportList = () => {
    return new Promise(async (resolve, reject) => {
        const sql = `
            SELECT
                support_id,
                mssv,
                support_type, -- Added this column
                title,
                description,
                contact_info,
                DATE_FORMAT(time_sent, '%Y-%m-%d %H:%i:%s') as time_sent,
                status,
                createdAt,
                updatedAt,
                CASE status      -- Updated CASE for new statuses and CSS classes
                    WHEN 'Resolved' THEN 'bg-success'
                    WHEN 'In Progress' THEN 'bg-info text-dark'
                    WHEN 'Pending' THEN 'bg-warning text-dark'
                    ELSE 'bg-secondary'
                END as statusClass
            FROM Support
            ORDER BY            -- Updated ORDER BY for new status priority
                CASE status
                    WHEN 'Pending' THEN 1
                    WHEN 'In Progress' THEN 2
                    WHEN 'Resolved' THEN 3
                    ELSE 4
                END,
                time_sent DESC;`;

        try {
            const [results] = await connection.promise().query(sql);
            resolve(results);
        } catch (err) {
            console.error("DB error fetching support list:", err);
            reject(err);
        }
    });
};

const updateSupportStatus = (supportId, newStatus) => {
    return new Promise(async (resolve, reject) => {
        const sql = `
            UPDATE Support 
            SET status = ?, updatedAt = CURRENT_TIMESTAMP 
            WHERE support_id = ?
        `;

        try {
            const [result] = await connection.promise().query(sql, [newStatus, supportId]);
            resolve(result);
        } catch (error) {
            console.error("DB Error khi cập nhật trạng thái:", error);
            reject(error);
        }
    });
};
const createSupport = ({ mssv, support_type, title, description, contact_info }) => {
    return new Promise(async (resolve, reject) => {
        const sql = `
            INSERT INTO Support (
                mssv, support_type, title, description, contact_info,
                time_sent, status, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, NOW(), 'Pending', NOW(), NOW())
        `;

        try {
            const [result] = await connection.promise().query(sql, [
                mssv,
                support_type,
                title,
                description,
                contact_info || null
            ]);
            resolve(result);
        } catch (error) {
            console.error("DB error khi tạo yêu cầu hỗ trợ:", error);
            reject(error);
        }
    });
};
const getStatusesByMssv = async (mssv) => {
    return new Promise(async (resolve, reject) => {
        const sql = `
            SELECT support_id, title, status 
            FROM Support 
            WHERE mssv = ?
        `;

        try {
            const [rows] = await connection.promise().query(sql, [mssv]);
            resolve(rows);
        } catch (error) {
            console.error("DB error khi lấy trạng thái yêu cầu:", error);
            reject(error);
        }
    });
};


module.exports = {
    getSupportList,
    updateSupportStatus,
    createSupport,
    getStatusesByMssv
};