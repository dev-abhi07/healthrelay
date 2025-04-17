const Helper = require("../../helper/helper");
const doctors = require("../../models/doctors");
const otp_s = require("../../models/otp");
const specialization = require("../../models/specialization");
const users = require("../../models/users");
const jwt = require("jsonwebtoken");
exports.sendOTP = async (req, res) => {

    try {
        const { mobile } = req.body
        if (!mobile) {
            return Helper.response(
                false,
                "Mobile number is required",
                [],
                res,
                200
            );
        }

        otp_data = new otp_s()

        otp_data.mobile = mobile
        otp_data.otp = Math.floor(100000 + Math.random() * 900000)
        otp_data.status = 'pending'
        otp_data.expireAt = new Date(new Date().getTime() + 5 * 60000)
        otp_data.save()
        return Helper.response(true, "OTP sent successfully", { otp: otp_data.otp }, res, 200);
    } catch (error) {
        return Helper.response(
            false,
            error.errors[0]?.message,
            [],
            res,
            200
        );
    }
}

exports.verify = async (req, res) => {
    try {
        const { mobile, otp } = req.body
        let is_register = false
        let UpdatedData = []
        if (!mobile || !otp) {
            return Helper.response(
                false,
                "Mobile number and OTP are required",
                [],
                res,
                200
            );
        }
        const userData = await users.count({
            where: {
                mobile: mobile
            }
        })
        if (userData > 0) {
            const usersInfo = await users.findOne({
                where: {
                    mobile: mobile
                }
            })
            is_register = true
            let token = jwt.sign(
                { id: usersInfo.id, role: usersInfo.role },
                process.env.SECRET_KEY,
                {
                    expiresIn: "7d",
                }
            );
            usersInfo.token = token
            usersInfo.ip = Helper.getLocalIP()
            UpdatedData = await usersInfo.save()            
        }
        const otp_Data = await otp_s.findOne({
            where: {
                mobile: mobile,
                otp: otp,
            }
        })
        if (!otp_Data) {
            return Helper.response(
                false,
                "Invalid OTP",
                [],
                res,
                200
            );
        }
        if (otp_Data.status == 'verified') {
            return Helper.response(
                false,
                "OTP already verified",
                [],
                res,
                200
            );
        }
        if (otp_Data.expireAt < new Date()) {
            return Helper.response(
                false,
                "OTP expired",
                [],
                res,
                200
            );
        }
        otp_Data.status = 'verified'
        await otp_Data.save()
        return Helper.response(true, "OTP verified successfully", { is_register: is_register,usersInfo:UpdatedData }, res, 200);
    } catch (error) {
        console.log(error)
        return Helper.response(
            false,
            error.errors[0]?.message,
            [],
            res,
            200
        );
    }
}

exports.register = async (req, res) => {
    try {
        const { name, mobile, pin_code, gender, date_of_birth } = req.body
        const register = new users()
        register.name = name
        register.mobile = mobile
        register.pin_code = pin_code
        register.gender = gender
        register.date_of_birth = date_of_birth
        if (await register.save()) {

            const update_token = await users.findByPk(register.id)
            let token = jwt.sign(
                { id: register.id, role: 'user' },
                process.env.SECRET_KEY,
                {
                    expiresIn: "7d",
                }
            );
            update_token.token = token
            update_token.ip = Helper.getLocalIP()
            await update_token.save()
            return Helper.response(true, "You have register successfully!", { update_token }, res, 200);
        } else {
            return Helper.response(false, "Technical error", {}, res, 200);
        }
    } catch (error) {
        return Helper.response(
            false,
            error.errors[0]?.message,
            [],
            res,
            200
        );
    }

}

exports.getRecord = async (req, res) => {
    const axios = require('axios');
    let data = JSON.stringify({
        "HospitalId": "CH03",
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://exprohelp.com/ChandanMobileWebApiNew/api/Hospital/ourSpecialists',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM4YTMwM2E5LWU4ZjMtNDE1NS1hYWJlLTYzOGIyN2U5MDA1ZCIsInJvbGUiOiJjYW1wIiwiaWF0IjoxNzQ0MzQ4NTM1LCJleHAiOjE3NDQ5NTMzMzV9.SdXvKHKIumXKApXTosPMBeXE1w5BhQ0PrwXy_AqPL_0'
        },
        data: data
    };


    axios.request(config)
        .then((response) => {
            response.data['dataSet']['Table'].forEach(async (element) => {
                const data = {
                    doctors_id: element.DoctorId,
                    name: element.Doctor_Name,
                    degree: element.Degree,
                    designation: element.Designation,
                    dept_name: element.dept_name,
                    doctor_img: element.ImageUrl
                }
                await doctors.create(data)
            });
        })
        .catch((error) => {
            console.log(error);
        });

}