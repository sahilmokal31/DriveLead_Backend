

const express = require('express')
const authMiddleware = require("../middleware/authJwt");
const { Signup, VerifyOtp, Login, Logout, Me } = require('../controller/auth.controller');
const router = express.Router()

router.post('/sign-up',Signup)
router.post('/verify',VerifyOtp)
router.post('/login',Login)
router.get('/logout',[authMiddleware],Logout)
router.get('/me',[authMiddleware],Me)

module.exports = router;