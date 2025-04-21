import connection from "../config/connectDB"

const getFeedbackList = async () => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM Feedbacks ',
            (err, results) => {
                if (err) {
                    console.log("DB error:", err);
                    return reject(err);
                }
                resolve(results);
            }
        );
    });
};

const createFeedback = async (data) => {
    const { mssv, rating, comment } = data;

    const checkUserSql = `SELECT * FROM Users WHERE mssv = ?`;
    const insertFeedbackSql = `
        INSERT INTO Feedbacks (mssv, rating, comment, Time, createdAt, updatedAt)
        VALUES (?, ?, ?, NOW(), NOW(), NOW())
    `;

    try {
        // Kiểm tra mssv tồn tại
        const [users] = await connection.promise().query(checkUserSql, [mssv]);
        if (users.length === 0) {
            throw new Error("MSSV không tồn tại trong hệ thống.");
        }

        // Thêm feedback
        const [result] = await connection.promise().query(insertFeedbackSql, [
            mssv, rating, comment || null
        ]);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getFeedbackList,
    createFeedback
}