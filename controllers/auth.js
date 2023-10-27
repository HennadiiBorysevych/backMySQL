const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const db = require("../model/db");

exports.register = (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  db.start.query(
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

      db.start.query(
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

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render("login", {
      message: "Please provide email and password",
    });
  }

  db.start.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (error, result) => {
      // console.log(result);
      // console.log(password);

      const isPasswordCorrect = bcrypt.compare(password, result[0].password);

      if (!isPasswordCorrect || !result) {
        return res.status(401).render("login", {
          message: "Incorrect email or password",
        });
      } else {
        const id = result[0].id;

        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: "5h",
        });

        const cookieOption = {
          expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };

        res.cookie("jwt", token, cookieOption);

        res.status(200).redirect("/");
      }
    }
  );

  // res.send("form submit");
};

exports.isLoggedIn = async (req, res, next) => {
  // console.log(req.cookies.jwt);

  if (req.cookies.jwt) {
    console.log("1");
    try {
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      // console.log(decoded);

      db.start.query(
        "SELECT * FROM users WHERE id = ?",
        [decoded.id],
        (error, result) => {
          console.log("🚀 : result", result);

          if (!result) {
            next();
          }

          req.user = result[0];

          return next();
        }
      );
    } catch (error) {
      return next();
    }
  } else {
    next();
  }
};


exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).redirect("/");
};