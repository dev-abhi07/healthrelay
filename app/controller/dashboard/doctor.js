const Helper = require("../../helper/helper");
const doctors = require("../../models/doctors");



exports.doctorProfile = async(req,res)=>{
    try{
        const doctorId = req.users.id
        const doctor = await doctors.findOne({
            where:{
                id:doctorId
            },
        })
        if(!doctor){
            return Helper.response(true, "No Record Found!", null, res, 200);
        }
        return Helper.response(true, " Record Found successfully",doctor, res, 200);
            
        
    }catch(err){
        return Helper.response(false,err.message, {}, res, 200);
    }
}


