import express from "express";
const router = express.Router();
import apiController from '../controller/apiController.js'
import roomController from '../controller/roomController.js'
import bookingController from "../controller/bookingController.js";
import authenticateToken from "../controller/authenticateToken.js";
import supportController from '../controller/supportController.js';
import feedbackController from "../controller/feedbackController.js";


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
    // booking
    router.post('/booking', authenticateToken, bookingController.createBooking);
    router.post('/check-availability', authenticateToken, bookingController.checkAvailability);
    //huy booking 
    router.post('/booking/:bookingId/cancel', bookingController.handleCancelBooking);
    router.post('/booking/book-now', authenticateToken, bookingController.handleBookNow)
    //booking mssv
    router.get('/bookings/student/:mssv', bookingController.getStudentBookings);
    //sp
    router.post('/support', supportController.createSupport);
    router.get('/support/user/:mssv/status', supportController.getSupportStatusByMssv);

    //fb
    router.post('/feedback', feedbackController.createFeedback);
    //chen in,out
    router.post('/bookings/:bookingId/checkin',  authenticateToken, bookingController.handleCheckIn);
    router.post('/bookings/:bookingId/checkout',  authenticateToken, bookingController.handleCheckOut);
    //update booking
    router.patch('/bookings/:bookingId', authenticateToken, bookingController.updateBooking);
    //INFOR
    router.get("/users/me", authenticateToken, apiController.getCurrentUserProfile); 
    return app.use("/api/v1/",router);
}

export default initApiRouter;