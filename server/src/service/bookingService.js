import connection from "../config/connectDB"

const getBookingList = async () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                b.ID AS id,
                b.mssv,
                b.Day,
                b.start_time,
                b.end_time,
                b.status,
                r.location AS room_name
            FROM 
                Bookings b
            JOIN 
                Rooms r ON b.room_id = r.ID
            ORDER BY 
                b.Day DESC, b.start_time ASC
        `;

        connection.query(sql, (err, results) => {
            if (err) {
                console.log("DB error:", err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    getBookingList
};
