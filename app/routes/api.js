const express = require("express");
const { sendOTP, verify, register, getRecord, updateUser, doctorDetails } = require("../controller/auth/register");
const { profile } = require("../controller/auth/customer");

const { healthCenters } = require("../controller/centres");
const { createDisease, updateDisease, deleteDisease } = require("../controller/dashboard/master");
const { createSpecialization, updateSpecialization, deleteSpecialization, specializationList, specializationListDD } = require("../controller/specialization");
const { bookAppointment } = require("../controller/dashboard/appointment");
const upload = require("../middleware/upload");
const { AddPrescription, getPrescription } = require("../controller/doctors");
const { doctorProfile } = require("../controller/dashboard/doctor");
const { medicineList, medicineById, addToCart, getCart, deleteCartItem, updateCartItem, checkout, orderSummary, orderList, orderDetails, cancelOrder, reOrder} = require("../controller/medicine");
const { Admin } = require("../middleware/auth");
const { createAddress, stateListDD, cityListDD, updateAddress, addressList, helpCenter } = require("../controller/dashboard/user");
const { mapDetails } = require("../controller/dashboard/dashboard");

const router = express.Router();

router.post('/map-details',mapDetails)
router.post('/send-otp',sendOTP)
router.post('/verify-otp',verify)
router.post('/register-user',register)
router.post('/update-user',Admin,updateUser)
router.post('/profile',Admin,profile)
router.post('/health-centers',Admin,healthCenters)
router.post('/record',getRecord)
router.post('/add-disease',createDisease)
router.post('/doctor-details',doctorDetails)


//disease
router.post('/update-disease',Admin,updateDisease)
router.post('/delete-disease',Admin,deleteDisease)

//Specialization
router.post('/add-specialization',Admin,createSpecialization)
router.post('/update-specialization',Admin,updateSpecialization)
router.post('/delete-specialization',Admin,deleteSpecialization)
router.post('/specialization-list',Admin,specializationList)
router.post('/specialization-list-dd',Admin,specializationListDD)


//prescription
router.post('/add-prescription',Admin,upload,AddPrescription)
router.post('/get-prescription',Admin,getPrescription)

//doctors
router.post('/doctor-profile',Admin,doctorProfile)

//medicines
router.post('/medicine-list',Admin,medicineList)
router.post('/medicine-details',Admin,medicineById)
router.post('/add-cart',Admin,addToCart)
router.post('/get-cart',Admin,getCart)
router.post('/delete-cart',Admin,deleteCartItem)
router.post('/update-cart',Admin,updateCartItem)
router.post('/checkout',Admin,checkout)
router.post('/order-summary',Admin,orderSummary)
router.post('/order-list',Admin,orderList)
router.post('/order-details',Admin,orderDetails)
router.post('/cancel-order',Admin,cancelOrder)
router.post('/re-order',Admin,reOrder)

//user details
router.post('/add-address',Admin,createAddress)
router.post('/state-list-dd',Admin,stateListDD)
router.post('/city-list-dd',Admin,cityListDD)
router.post('/update-address',Admin,updateAddress)
router.post('/address-list',Admin,addressList)
router.post('/need-help',Admin,helpCenter)








module.exports = router