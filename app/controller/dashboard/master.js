const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const disease = require("../../models/disease");
const specialization = require("../../models/specialization");


exports.createDisease = async (req,res) => {
    try {
        const { name } = req.body
        const diseases = new disease()

        diseases.name =name
        await diseases.save()
        return Helper.response(true, "Disease created successfully!", {}, res, 200);
    } catch (error) {
        console.log(error)
        return Helper.response(false, "Server Error", {}, res, 200);
    }
}
exports.diseaseList = async (req,res) => {
    try {
        const { name } = req.body
        const diseases = await disease.findAll()
        return Helper.response(true, "Disease created successfully!", {diseases}, res, 200);
    } catch (error) {
        console.log(error)
        return Helper.response(false, "Server Error", {}, res, 200);
    }
}