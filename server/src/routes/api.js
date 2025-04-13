import express from 'express';
import userController from '../controller/userController.js';
import bookingController from '../controller/bookingController.js';
import checkinoutController from '../controller/checkinoutController.js';
import deviceController from '../controller/deviceController.js';
import feedbackController from '../controller/feedbackController.js';
import inforController from '../controller/inforController.js';
import roomController from '../controller/roomController.js';
import supportController from '../controller/supportController.js';

const router = express.Router();

// Users
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Bookings
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.post('/bookings', bookingController.createBooking);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);

// Check-in/Check-out
router.get('/checkinouts', checkinoutController.getAllCheckinouts);
router.get('/checkinouts/:id', checkinoutController.getCheckinoutById);
router.post('/checkinouts', checkinoutController.createCheckinout);
router.put('/checkinouts/:id', checkinoutController.updateCheckinout);
router.delete('/checkinouts/:id', checkinoutController.deleteCheckinout);

// Devices
router.get('/devices', deviceController.getAllDevices);
router.get('/devices/:id', deviceController.getDeviceById);
router.post('/devices', deviceController.createDevice);
router.put('/devices/:id', deviceController.updateDevice);
router.delete('/devices/:id', deviceController.deleteDevice);

// Feedback
router.get('/feedbacks', feedbackController.getAllFeedbacks);
router.get('/feedbacks/:id', feedbackController.getFeedbackById);
router.post('/feedbacks', feedbackController.createFeedback);
router.put('/feedbacks/:id', feedbackController.updateFeedback);
router.delete('/feedbacks/:id', feedbackController.deleteFeedback);

// Information
router.get('/infors', inforController.getAllInfors);
router.get('/infors/:id', inforController.getInforById);
router.post('/infors', inforController.createInfor);
router.put('/infors/:id', inforController.updateInfor);
router.delete('/infors/:id', inforController.deleteInfor);

// Rooms
router.get('/rooms', roomController.getAllRooms);
router.get('/rooms/:id', roomController.getRoomById);
router.post('/rooms', roomController.createRoom);
router.put('/rooms/:id', roomController.updateRoom);
router.delete('/rooms/:id', roomController.deleteRoom);

// Support
router.get('/supports', supportController.getAllSupports);
router.get('/supports/:id', supportController.getSupportById);
router.post('/supports', supportController.createSupport);
router.put('/supports/:id', supportController.updateSupport);
router.delete('/supports/:id', supportController.deleteSupport);

export default router;