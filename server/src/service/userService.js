import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import connection from "../config/connectDB"

const hashuserpass = (userpass) =>{
  return bcrypt.hashSync(userpass, salt);
}

const createNewUser = (mssv, fullName, email, pass, phone, sex, role) =>{
    let hashpass = hashuserpass(pass);
    const query = `INSERT INTO Users (mssv, fullName, email, pass, phone, sex, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    connection.query(query, [mssv, fullName, email, hashpass, phone, sex, role], (err, results) => {
        if (err) {
        console.error("Insert error:", err); 
    } else {
        console.log("Insert success!");
    }
    });
}

const updateUser = async (mssv, fullName, email, phone, sex, role, pass = null) => {
    return new Promise(async (resolve, reject) => {
      let sql = '';
      let values = [];
  
      if (pass && pass.trim() !== '') {
        const hashedPassword = await bcrypt.hash(pass, 10);
        sql = `UPDATE Users SET FullName = ?, Email = ?, Phone = ?, Sex = ?, Role = ?, Pass = ? WHERE mssv = ?`;
        values = [fullName, email, phone, sex, role, hashedPassword, mssv];
      } else {
        sql = `UPDATE Users SET FullName = ?, Email = ?, Phone = ?, Sex = ?, Role = ? WHERE mssv = ?`;
        values = [fullName, email, phone, sex, role, mssv];
      }
  
      connection.query(sql, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };

const deleteUser = (mssv) => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM Users WHERE mssv = ?";
      connection.query(sql, [mssv], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };

const getUserList = async () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM Users', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
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

module.exports = {
    createNewUser,
    updateUser,
    deleteUser,
    getUserList,
    findUserByMSSVOrEmail,
  };
  