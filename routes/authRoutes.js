const express = require('express');
const { sendOTP, verifyOTP, checkLogin} = require('../controllers/authController');
const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/check-login', checkLogin);

router.get('/login', (req, res) => {
  return res.render("login.ejs")
});
router.get('/signup', (req, res) => {
  return res.render("signup.ejs")
})

router.get('/otp-verification', (req, res) => {
  return res.render("otp-verification.ejs");
})
router.get('/error', (req, res) => {
  return res.render("server_error.ejs");
})


module.exports = router;