import express from "express";
import homeComtroller from '../controller/homeComtroller'
const router = express.Router();

/**
 * @param {*} app : express app
 */

const iniWebRouter = (app) => {
    router.get("/", homeComtroller.login);
    router.post("/home", homeComtroller.home);
    router.post("/home/account", homeComtroller.account);

    return app.use("/",router);
}

export default iniWebRouter;