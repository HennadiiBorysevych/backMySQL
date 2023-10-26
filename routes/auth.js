const express = require("express");
const authCotroller = require("../controllers/auth");

const router = express.Router();

router.post("/register", authCotroller.register);
router.post("/login", authCotroller.login);


// router.post("/logout", authCotroller.logout);

module.exports = router;
