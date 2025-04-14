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

module.exports = {
    getFeedbackList
}