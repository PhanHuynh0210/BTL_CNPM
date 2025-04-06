import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import checkconnect from "./config/connectDB";
import { CHAR } from "sequelize";

const app = express();
const PORT = process.env.PORT || 8080;

//config view engine
configViewEngine(app);

//checkconnect
checkconnect();

//init web routes
initWebRoutes(app);

app.listen(PORT, () => {
    console.log(" Runner "+PORT);
})