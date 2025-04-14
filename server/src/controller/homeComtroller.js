import userService from '../service/userService'
import bookingService from '../service/bookingService'
import feedbackService from '../service/feedbackService'


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

    req.session.loggedin = true;
    req.session.username = user.fullName;
    req.session.userId = user.mssv; 
    res.redirect("/home");
   
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

const updateAccount = async (req, res) => {
    const { mssv, fullName, email, phone, sex, role, pass } = req.body;
  
    try {
      await userService.updateUser(mssv, fullName, email, phone, sex, role, pass);
      res.redirect("/home");
    } catch (error) {
      console.error('Lỗi khi cập nhật tài khoản:', error);
      res.status(500).send('Lỗi khi cập nhật tài khoản');
    }
  };  

const home = async (req, res) => {
    if (req.session.loggedin) {
        try {
            const accounts = await userService.getUserList(); 
            const bookings = await bookingService.getBookingList();
            const feedback = await feedbackService.getFeedbackList();

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


const account = async (req, res) => {
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
    try {
      await userService.deleteUser(mssv);
      res.redirect("/home");
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      res.status(500).send("Lỗi khi xóa người dùng");
    }
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
