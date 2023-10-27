const express = require("express");
const authCotroller = require("../controllers/auth");

const router = express.Router();

router.get("/", authCotroller.isLoggedIn, (req, res) => {
  // console.log(req.user);

  res.render("index", {
    user: req.user,
  });
});



router.get('/profile', authCotroller.isLoggedIn, (req, res) => {
  console.log("inside");
  console.log(req.user);
  if(req.user) {
    res.render('profile', {
      user: req.user
    });
  } else {
    res.redirect("/login");
  }
  
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
