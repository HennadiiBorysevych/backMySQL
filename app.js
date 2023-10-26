const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv").config({ path: "./.env" });
const db = require("./model/db");

const app = express();

const publicDir = path.join(__dirname, "/public");

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "hbs");

app.use(express.static(publicDir));

db.start.connect(function (err) {
  if (err) {
    console.log("Error connecting to the database");
  } else {
    console.log("Connected to MYSQL");
  }
});

// app.get("/", (req, res) => {
//   res.render('index')
// });

// app.get("/register", (req, res) => {
//   res.render('register')
// });

app.use("/", require("./routes/pages"));

app.use("/auth", require("./routes/auth"));

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
