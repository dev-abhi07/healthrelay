const express = require("express");
const { login } = require("../controller/auth/login");
const Admin = require("../middleware/auth");
const { dashboard } = require("../controller/dashboard/dashboard");
const { doctors } = require("../controller/doctors");
const { healthCenters } = require("../controller/centres");
const { addAppointment } = require("../controller/dashboard/appointment");
const { createDisease, diseaseList } = require("../controller/dashboard/master");


const router = express.Router();

router.post('/login',login)
router.post('/dashboard',Admin,dashboard)
router.post('/doctors-list',Admin,doctors)
router.post('/health-centers',healthCenters)


//Appointment

router.post('/add-appointment',addAppointment)


//Master 
// router.post('/add-disease',createDisease)
router.post('/disease-list',diseaseList)

module.exports = router