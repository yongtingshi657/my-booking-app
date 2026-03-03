const express = require("express");
const { register, login, getMe } = require("../controllers/auth");
const authenticateUser = require('../middleware/authentication')

const router = express.Router();

router.post("/register", register);

router.post('/login',login)

router.get('/me', authenticateUser, getMe)

module.exports = router