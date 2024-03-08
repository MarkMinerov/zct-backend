import argv from "minimist";
import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import axios from "axios";
import mysql from "mysql2/promise";
import fs from "fs";
import "dotenv/config";

// API
import register from "./api/auth/register.js";
import login from "./api/auth/login.js";
import predict from "./api/predict.js";

// API middleware
import authTokenMiddleware from "./api/middleware/authToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = argv(process.argv.slice(2));

const MODE = args.mode;
const MODEL_NAME = process.env.MODEL_NAME;
let AI_URL;

const app = express();
app.use(cors());
app.use(bodyParser.json());

let dbConfig;

switch (MODE) {
  case "production": {
    const index = path.join(__dirname, process.env.WEB_BUILD_NAME_FOLDER_NAME);
    app.use(express.static(index));
    AI_URL = `${process.env.MODEL_API_URL_PROD}/${MODEL_NAME}`;
    dbConfig = { host: process.env.DB_HOST_PROD };

    app.get("*", (req, res) => res.sendFile(path.join(index, "index.html")));
    break;
  }

  case "development": {
    AI_URL = `${process.env.MODEL_API_URL_DEV}/${MODEL_NAME}`;
    dbConfig = { host: process.env.DB_HOST_DEV };
  }
}

dbConfig = {
  ...dbConfig,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
};

try {
  const conn = await mysql.createConnection(dbConfig);

  // init database
  const sql = fs.readFileSync("init_database.sql").toString();
  const result = await conn.query(sql);

  // api routes
  app.post("/register", register(conn));
  app.post("/login", login(conn));
  app.post("/predict", authTokenMiddleware, predict(conn, AI_URL));

  app.listen(5000, () => {
    console.info("Server is listening on port 5000...");
  });
} catch (e) {
  console.error(e);
}
