import express from "express";
const router = express.Router();
import apiController from '../controller/apiController.js'
import roomController from '../controller/roomController.js'


/**
 * @param {*} app : express app
 */

const initApiRouter = (app) => {
    router.get("/test-api",apiController.testapi);
    router.post("/register",apiController.handleRegister);

    router.post("/login", apiController.handleLoginapi);
    router.post('/logout', apiController.logoutUser)
    // phòng trống
    router.get('/available', roomController.listAvailableRooms);
    // tất cả room
    router.get('/allroom', roomController.getAllRooms);

    module.exports = router;
    return app.use("/api/v1/",router);
}

export default initApiRouter;