import connection from "../config/connectDB"

const getBookingList = async () => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM Bookings ',
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

module.exports ={
    getBookingList
}