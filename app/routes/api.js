const express = require("express");
const { sendOTP, verify, register, getRecord } = require("../controller/auth/register");
const { profile } = require("../controller/auth/customer");
const Admin = require("../middleware/auth");
const { healthCenters } = require("../controller/centres");
const { createDisease } = require("../controller/dashboard/master");
const router = express.Router();


router.post('/send-otp',sendOTP)
router.post('/verify-otp',verify)
router.post('/register-user',register)
router.post('/profile',Admin,profile)
router.post('/health-centers',Admin,healthCenters)
router.post('/record',getRecord)
router.post('/add-disease',createDisease)
module.exports = router