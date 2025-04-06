import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";

const app = express();
const PORT = process.env.PORT || 8080;

//config view engine
configViewEngine(app);

//init web routes
initWebRoutes(app);

app.listen(PORT, () => {
    console.log(" Runner "+PORT);
})