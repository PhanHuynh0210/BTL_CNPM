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
    req.session.userId = user.mssv; 
    res.redirect("/home");
   

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
    account,
    logout 
};
