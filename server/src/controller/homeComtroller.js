import userService from '../service/userService'
import bcrypt from 'bcryptjs';

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

    const match = password === user.Pass;
    if (!match) {
        return res.render("login.ejs", { error: "Sai mật khẩu!" });
    }

    // Đăng nhập thành công
    req.session.loggedin = true;
    req.session.username = user.fullName;
    res.redirect("/home");
   

};

const home = (req, res) => {
    if (req.session.loggedin) {
        return res.render("home.ejs", { username: req.session.username });
    } else {
        return res.redirect("/");
    }
};

const account = (req, res) => {
    let mssv = req.body.mssv;
    let fullName = req.body.fullName;
    let email = req.body.email;
    let pass = req.body.pass;
    let phone = req.body.phone;
    let sex = req.body.sex;
    let role = req.body.role;

    //userService.createNewUser(mssv, fullName, email, pass, phone, sex, role);
    userService.getUserlish();
};

module.exports = {
    login,
    handleLogin,
    home,
    account
};
