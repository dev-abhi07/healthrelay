const express = require("express");
const { login, logout } = require("../controller/auth/login");

const { dashboard } = require("../controller/dashboard/dashboard");
const { doctors, doctorListDD, createDoctor, bulkInsertDoctors } = require("../controller/doctors");
const { healthCenters } = require("../controller/centres");
const { addAppointment, appointmentList, getAvailableSlotsInRange, getRecurringSlots, getAvailableSlots, totalSlots, getSlotsForDate, bookAppointment, upcomingMeetings, bookingDetails, meetingsToken } = require("../controller/dashboard/appointment");
const { createDisease, diseaseList, diseaseListDD, createDepartment, departmentListDD, updateDepartment, deleteDepartment, departmentList } = require("../controller/dashboard/master");
const upload = require("../middleware/upload");
const { Admin } = require("../middleware/auth");
const { addPromotion, promotionList, updatePromotion, deletePromotion, userList, slotList } = require("../controller/admin");


const router = express.Router();

router.post('/login',login)
router.post('/log-out',Admin,logout)
router.post('/dashboard',Admin,dashboard)
router.post('/doctors-list',Admin,doctors)
router.post('/doctors-list-dd',Admin,doctorListDD)
router.post('/health-centers',healthCenters)


//Appointment

router.post('/add-appointment',Admin,addAppointment)
router.post('/meeting',Admin,meetingsToken)

router.post('/total-slots',Admin,totalSlots)
router.post('/booking-details',Admin,bookingDetails)
router.post('/add',upload,Admin,bookAppointment)
router.post('/appointment-list',Admin,appointmentList)
router.post('/upcoming-meetings',Admin,upcomingMeetings)

//doctors
router.post('/add-doctor',upload,Admin,createDoctor)
router.post('/slot-list',Admin,slotList)
router.post('/bulk-insert',bulkInsertDoctors)


//Master 
// router.post('/add-disease',createDisease)
router.post('/disease-list',Admin,diseaseList)
router.post('/disease-list-dd',Admin,diseaseListDD)

//departments
router.post('/create-department',Admin,createDepartment)
router.post('/department-list-dd',Admin,departmentListDD)
router.post('/update-department',Admin,updateDepartment)
router.post('/delete-department',Admin,deleteDepartment)
router.post('/department-list',Admin,departmentList)

//promotions
router.post('/create-promotion',Admin,addPromotion)
router.post('/promotion-list',Admin,promotionList)
router.post('/update-promotion',Admin,updatePromotion)
router.post('/delete-promotion',Admin,deletePromotion)

//users
router.post('/user-list',Admin,userList)





module.exports = router