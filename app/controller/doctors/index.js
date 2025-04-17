const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const doctors = require("../../models/doctors");

exports.doctors = async(req,res) => {
    try {
        const doctorsData = await doctors.findAll()
        if(doctorsData)
        return Helper.response(true, null, doctorsData, res, 200);
        else
        return Helper.response(true, "No Record Found!", doctorsData, res, 200);
    } catch (error) {
        return Helper.response(false, null, {error}, res, 200);
    }
}