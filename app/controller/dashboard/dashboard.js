const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const doctors = require("../../models/doctors");
const Map = require("../../models/map");
const users = require("../../models/users");

exports.dashboard = async (req, res) => {
    try {
        switch (req.users.role) {
            case "admin":
                const totalUsers = await users.count({
                    where: {
                        role: 'user'
                    }
                })
                return Helper.response(
                    true,
                    "Welcome to Dashboard",
                    { totalCustomer: totalUsers },
                    res,
                    200
                );
                break;
            case "user":
                const doctorsData = await doctors.findAll()
                return Helper.response(
                    true,
                    null,
                    { doctorsData },
                    res,
                    200
                );
            default:
                break;
        }
    } catch (error) {
        return Helper.response(
            false,
            "Server Error",
            { error },
            res,
            200
        );
    }
}


exports.mapDetails = async(req,res)=>{
    try{
        const data = await Map.findAll()
        return Helper.response(true,'map details found successfully',data,res,200)

    }catch(err){
        return Helper.response(false,err.message,{},res,200)
    }
}