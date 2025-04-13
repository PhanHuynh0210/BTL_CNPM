import bcrypt from "bcryptjs";
// import db from '../models/index.js'
const db = require('../models/index.js')
const salt = bcrypt.genSaltSync(10);
import QueryTypes from "sequelize/lib/query-types";
const { INSERT, SELECT } = QueryTypes;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'BTL_CNPM'
})
const hashuserpass = (userpass) =>{
  return bcrypt.hashSync(userpass, salt);
}

const createNewUser = async (mssv, fullName, email, pass, phone, sex, role) => {
    try {
        const hashpass = hashuserpass(pass);
        await db.Users.create({
            mssv,
            FullName: fullName,
            Email: email,
            Pass: hashPass,
            Phone: phone,
            Sex: sex,
            Role: role,
        });
        console.log('Insert success!');
    } catch (err) {
        console.error('Insert error:', err);
        throw err;
    }
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

const getUserById = async (mssv) => {
    try {
        return await db.Users.findByPk(mssv);
    } catch (err) {
        console.error('DB error:', err);
        throw err;
    }
};

const updateUser = async (mssv, userData) => {
try {
    const user = await db.Users.findByPk(mssv);
    if (!user) throw new Error('User not found');
    if (userData.pass) {
    userData.Pass = hashUserPass(userData.pass);
    delete userData.pass; // Remove plain password from data
    }
    return await user.update(userData);
} catch (err) {
    console.error('DB error:', err);
    throw err;
}
};

const deleteUser = async (mssv) => {
    try {
      const user = await db.Users.findByPk(mssv);
      if (!user) throw new Error('User not found');
      return await user.destroy();
    } catch (err) {
      console.error('DB error:', err);
      throw err;
    }
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
    getUserById,
    updateUser,
    deleteUser,
    findUserByMSSVOrEmail,
    getBookingList,
    getFeedbackList
}