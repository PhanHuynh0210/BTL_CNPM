import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import mysql from 'mysql2';
import { INSERT, SELECT } from 'sequelize/lib/query-types';


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'BTL_CNPM'
})
const hashuserpass = (userpass) =>{
  return bcrypt.hashSync(userpass, salt);
}

const createNewUser = (mssv, fullName, email, pass, phone, sex, role) =>{
    let hashpass = hashuserpass(pass);
    const query = `INSERT INTO Users (mssv, fullName, email, pass, phone, sex, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    connection.query(query, [mssv, fullName, email, hashpass, phone, sex, role], (err, results) => {
        if (err) {
        console.error("Insert error:", err); // ➕ log lỗi
    } else {
        console.log("Insert success!");
    }
    });
}

const getUserList = async () => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM Users',
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


const findUserByMSSVOrEmail = async (loginInput) => {
    return new Promise((resolve, reject) => {
        connection.query(
            'SELECT * FROM Users WHERE mssv = ? OR email = ?',
            [loginInput, loginInput],
            (err, results) => {
                if (err) return reject(err);
                resolve(results.length > 0 ? results[0] : null);
            }
        );
    });
};

module.exports ={
    createNewUser,
    getUserList,
    findUserByMSSVOrEmail,
    getBookingList,
    getFeedbackList
}