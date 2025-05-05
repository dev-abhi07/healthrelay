const Helper = require("../../helper/helper");
const specialization = require("../../models/specialization");




exports.createSpecialization = async(req,res)=>{
    try{
        const data = await specialization.create({
            specialization:req.body.specialization,
        })
        if(!data){
            return Helper.response(false,'Your Specialization not created',{},res,200)
        }
        return Helper.response(true,'Your Specialization created successfully',data,res,200)

    }catch(err){
      return Helper.response(false, err.message,{}, res, 200);
    }
}

exports.updateSpecialization = async(req,res)=>{
    try{
        const {id}=req.body
        const updateData = {
            specialization:req.body.specialization
        }
        const data = await specialization.update(updateData,{
            where:{
                id:id
            }
        })
        if(!data){
            return Helper.response(false,'Your Specialization not updated',{},res,200)
        }
        return Helper.response(true,'Your Specialization updated successfully',{},res,200)

    }catch(err){
        return Helper.response(false, err.message,{}, res, 200);
    }
}

exports.deleteSpecialization = async(req,res)=>{
    try{
        const data = await specialization.destroy({
            where:{
                id:req.body.id
            }
        })
        if(!data){
            return Helper.response(false,'Your Specialization not deleted',{},res,200)
        }
        return Helper.response(true,'Your Specialization deleted successfully',{},res,200)

    }catch(err){
        return Helper.response(false, err.message,{}, res, 200);
    }
}

exports.specializationList = async(req,res)=>{
    try{
        const data = await specialization.findAll()
        if(!data){
            return Helper.response(false,'No Specialization found',{},res,200)
        }
        return Helper.response(true,'Specialization list',data,res,200)

    }catch(err){
        return Helper.response(false, err.message,{}, res, 200);
    }
}

exports.specializationListDD = async(req,res)=>{
    try{
        const result = await specialization.findAll()
        if(!result){
            return Helper.response(false,'No Specialization found',{},res,200)
        }

        const data = await Promise.all(
            result.map(async (item) =>(
                {
                    value:item.id,
                    label:item.specialization
                }
            )
        ))
        return Helper.response(true,'Specialization list',data,res,200)

    }catch(err){
        return Helper.response(false, err.message,{}, res, 200);
    }
}



