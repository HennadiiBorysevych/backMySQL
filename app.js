const path = require("path");
const express = require("express");

const mysql = require("mysql");

const dotenv = require("dotenv").config({ path: "./.env" });

const app = express();

const publicDir = path.join(__dirname, "/public");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: "",
  database: process.env.DB,
});

app.set("view engine", "hbs");

app.use(express.static(publicDir));

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL connected");
  }
});

app.get("/", (req, res) => {
  res.render('index')
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
