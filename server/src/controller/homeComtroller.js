import userService from '../service/userService'

const login = (req,res) => {
    return res.render("login.ejs");
}

const home = (req,res) => {
   return res.render("home.ejs");
}

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
}
module.exports = {
    login, home, account
}