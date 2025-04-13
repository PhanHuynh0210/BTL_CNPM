const testapi = (req, res) => {
    return res.status(200).json({
        message: 'ok',
        data: 'test api'
    })
}


 const handleRegister = (req, res) => {
    console.log("ditcomme")
}

const checkpass = (inputpass, hashpass) =>{
    return 
}
 

 module.exports = {
    testapi,handleRegister
 }