const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const healthCentre = require("../../models/healthCentre");
const users = require("../../models/users");


exports.profile = async (req,res) => {
    try {               
        const userData = await users.findOne({
            where:{
                id:req.users.id
            },
            attributes: ['id','name', 'mobile', 'date_of_birth','gender','pin_code','role','email','isPrime'],
        })
        return Helper.response(true,"User profile find successfully", userData.toJSON(), res, 200);
    } catch (error) {
        return Helper.response(false, null, error, res, 200);
    }
}

