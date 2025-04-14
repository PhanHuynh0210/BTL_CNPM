import userService from '../service/userService'
import bcrypt from 'bcryptjs';
const db = require('../config/connectDB');


const login = (req, res) => {
    return res.render("login.ejs");
};

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log(" Dữ liệu người dùng nhập:");
    console.log("Username (MSSV/Email):", username);
    console.log("Password:", password);

    if (!username || !password) {
        return res.render("login.ejs", { error: "Vui lòng nhập đầy đủ thông tin!" });
    }

    const user = await userService.findUserByMSSVOrEmail(username);
    console.log(" Dữ liệu người dùng từ DB:", user);
    if (!user) {
        return res.render("login.ejs", { error: "Không tìm thấy tài khoản!" });
    }

    let match = false;

    try {
        match = await bcrypt.compare(password, user.Pass);
    } catch (err) {
        console.error("Lỗi so sánh bcrypt:", err);
    }

    if (!match) {
        match = password === user.Pass;
    }

    if (!match) {
        return res.render("login.ejs", { error: "Sai mật khẩu!" });
    }

    // Đăng nhập thành công
    req.session.loggedin = true;
    req.session.username = user.fullName;
    req.session.userId = user.mssv; 
    res.redirect("/home");
   

};


const updateAccount = async (req, res) => {
    const { mssv, fullName, email, phone, sex, role, pass } = req.body;

    let sql = '';
    let values = [];

    try {
        if (pass && pass.trim() !== '') {
            // Mã hóa mật khẩu nếu có nhập mới
            const hashedPassword = await bcrypt.hash(pass, 10);

            sql = `
                UPDATE Users 
                SET FullName = ?, Email = ?, Phone = ?, Sex = ?, Role = ?, Pass = ?
                WHERE mssv = ?`;
            values = [fullName, email, phone, sex, role, hashedPassword, mssv];
        } else {
            // Không cập nhật mật khẩu
            sql = `
                UPDATE Users 
                SET FullName = ?, Email = ?, Phone = ?, Sex = ?, Role = ?
                WHERE mssv = ?`;
            values = [fullName, email, phone, sex, role, mssv];
        }

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Lỗi khi cập nhật tài khoản:', err);
                return res.status(500).send('Lỗi khi cập nhật tài khoản');
            }
            res.redirect("/home");
        });
    } catch (error) {
        console.error('Lỗi khi mã hóa mật khẩu:', error);
        res.status(500).send('Đã xảy ra lỗi khi xử lý mật khẩu');
    }
};


const home = async (req, res) => {
    if (req.session.loggedin) {
        try {
            const accounts = await userService.getUserList(); 
            const bookings = await userService.getBookingList();
            const feedback = await userService.getFeedbackList();

            return res.render("home.ejs", {
                username: req.session.username,
                accounts: accounts,
                bookings: bookings,
                mssvLogin: req.session.userId,
                feedback: feedback
            });
        } catch (error) {
            console.log("Error fetching user accounts:", error);
            return res.status(500).send("Server error!");
        }
    } else {
        return res.redirect("/");
    }
};

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log("Lỗi", err);
            return res.status(500)
        }
        res.clearCookie("connect.sid");
        res.redirect("/"); 
    });
};




const account =  async (req, res) => {
    const { mssv, fullName, email, pass, phone, sex, role } = req.body;
    console.log("Account data:", req.body);
    await userService.createNewUser(mssv, fullName, email, pass, phone, sex, role);
    
    res.redirect("/home");
};

const deleteAccount = async (req, res) => {
    const { mssv } = req.params;
    if (mssv === req.session.userId) {
        return res.status(400).send("Không thể xóa chính mình.");
    }
    const sql = "DELETE FROM Users WHERE mssv = ?";

    db.query(sql, [mssv], (err, result) => {
        if (err) {
            console.error("Lỗi khi xóa người dùng:", err);
            return res.status(500).send("Lỗi khi xóa người dùng");
        }
        res.redirect("/home");
    });
};


module.exports = {
    login,
    handleLogin,
    home,
    account,
    logout,
    updateAccount,
    deleteAccount
};
