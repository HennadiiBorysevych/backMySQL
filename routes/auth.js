const express = require("express");
const authCotroller = require("../controllers/auth");

const router = express.Router();

router.post("/register", authCotroller.register);

module.exports = router;
