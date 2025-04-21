import connection from "../config/connectDB";

const getDevices = async () => {
    try {
        const sql = `
            SELECT 
                d.device_name, 
                r.id AS room_id
            FROM Devices d 
            JOIN Rooms r ON d.room_id = r.id
        `;
        
        const [devices] = await connection.promise().query(sql);
        return devices;

    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to fetch devices");
    }
};

export default {
    getDevices
};