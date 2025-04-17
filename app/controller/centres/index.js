const { literal, Op } = require("sequelize");
const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const healthCentre = require("../../models/healthCentre");



exports.healthCenters = async (req, res) => {
    const { latitude, longitude } = req.body;
    const radiusInKm = 20;
    try {
        const healthCentres = await healthCentre.findAll({
            attributes: [
                'id',
                'hospital_id',
                'name',
                'mobile',
                'email',
                'landline',
                'address',
                'pin_code',
                'state',
                'city',
                'latitude',
                'longitude',
                'labTest',
                'orderMedicine',
                'healthCheckup',
                'onlineConsult',
                [
                    sequelize.literal(`
                        6371 * acos(
                            cos(radians(${latitude})) * cos(radians(latitude)) *
                            cos(radians(longitude) - radians(${longitude})) +
                            sin(radians(${latitude})) * sin(radians(latitude))
                        )
                        `),
                    'distance'
                ]
            ],
            where: sequelize.literal(`
              6371 * acos(
                cos(radians(${latitude})) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(${longitude})) +
                sin(radians(${latitude})) * sin(radians(latitude))
              ) <= ${radiusInKm}
            `),
            order: sequelize.literal('distance ASC'),
            limit: 20
        });

        if(healthCentres.length > 0){
            return Helper.response(true, null, healthCentres, res, 200);
        }
        return Helper.response(false, "No Hospital Found on your location", doctorsData, res, 200);        

    } catch (error) {
        console.log(error)
        return Helper.response(false, null, {}, res, 200);
    }
}