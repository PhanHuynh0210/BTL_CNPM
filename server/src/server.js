import express from "express";
import configViewEngine from "./config/viewEngine.js";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api.js";
import checkconnect from "./config/connectDB";
import { CHAR } from "sequelize";
import bodyParser from "body-parser";
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 8080;

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

//checkconnect
checkconnect();

//init web routes
initWebRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})

//config .env
require('dotenv').config();
const { Sequelize } = require('sequelize');

//initialize DB connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);
