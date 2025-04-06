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
    });
}

const getUserlish = () =>{
    let acc = [];
    connection.query(
        ' Select * from Users ',
        function(err, results, fiedls){
           if(err){
            console.log(err)
           }
           console.log(results)
        }
    );
}
module.exports ={
    createNewUser, getUserlish
}

