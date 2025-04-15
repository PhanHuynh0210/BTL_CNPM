import express from "express";
const router = express.Router();
import apiController from '../controller/apiController.js'


/**
 * @param {*} app : express app
 */

const initApiRouter = (app) => {
    router.get("/test-api",apiController.testapi);
    router.post("/register",apiController.handleRegister);

    router.post("/login", apiController.handleLoginapi);
    router.post('/logout', apiController.logoutUser)

    module.exports = router;
    return app.use("/api/v1/",router);
}

export default initApiRouter;