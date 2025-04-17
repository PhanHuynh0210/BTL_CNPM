import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api";
import bodyParser from "body-parser";
import session from 'express-session';
import configCors from "./config/cors";
import cron from 'node-cron';
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

//configCors
configCors(app);

cron.schedule('*/5 * * * *', () => {
    console.log('--- Running Scheduled Job: Process Completed Bookings ---');
    bookingService.processCompletedBookings()
      .then(result => console.log('--- Completion Job Finished:', result, '---'))
      .catch(error => console.error('--- Completion Job Failed:', error, '---'));
  }, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
  });

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } 
}));


//config view engine
configViewEngine(app);

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//init web routes
initWebRoutes(app);
initApiRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})