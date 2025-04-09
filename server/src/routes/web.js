import express from "express";
import homeComtroller from '../controller/homeComtroller'
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
    
    return app.use("/",router);
}

export default iniWebRouter;