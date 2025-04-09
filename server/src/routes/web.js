import express from "express";
import * as homeComtroller from '../controller/homeComtroller.js';
const router = express.Router();

/**
 * @param {*} app : express app
 */

const iniWebRouter = (app) => {
    router.get("/", homeComtroller.login);router.get("/", homeComtroller.login);
    router.post("/auth", homeComtroller.handleLogin); 
    router.get("/home", homeComtroller.home); 
    router.post('/logout', homeComtroller.logout);
    router.post('/add-account', homeComtroller.account);
    router.post('/update-account', homeComtroller.updateAccount);

module.exports = router;

    
    return app.use("/",router);
}

export default iniWebRouter;