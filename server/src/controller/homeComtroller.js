const hanhello = (req,res) => {
     const name = "god";
    return res.render("home.ejs",{name});
}

const haluser = (req,res) => {
   return res.render("use.ejs");
}

module.exports = {
    hanhello, haluser
}