const express = require("express");

const mysql = require("mysql");

const dotenv = require("dotenv").config({ path: "./.env" });

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: "",
  database: process.env.DB,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL connected");
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Yo</h1>");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
