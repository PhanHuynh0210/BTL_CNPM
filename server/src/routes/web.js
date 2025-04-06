import express from "express";
import homeComtroller from '../controller/homeComtroller'
const router = express.Router();

/**
 * @param {*} app : express app
 */

const iniWebRouter = (app) => {
    router.get("/", homeComtroller.hanhello);
    router.get("/user", homeComtroller.haluser);
    return app.use("/",router);
}

export default iniWebRouter;