const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: "",
  database: process.env.DB,
});

exports.register = (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
      }
      console.log(result);
      if (result.length > 0) {
        return res.render("register", {
          message: "Than email is already taken",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Passwords dont match",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);

      console.log(hashedPassword);

      db.query(
        "INSERT INTO users SET ?",
        {
          name,
          email,
          password: hashedPassword,
        },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            return res.render("register", {
              message: "User Registered",
            });
          }
        }
      );
    }
  );

  // res.send("form submit");
};
