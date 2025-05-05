const { Op } = require("sequelize");
const Helper = require("../../helper/helper");
const Promotions = require("../../models/promotion");
const users = require("../../models/users");
const doctorsAvailability = require("../../models/doctorsAvailability");



exports.addPromotion = async(req,res)=>{
    try{
        if(req.users.role !== "admin") {
            return Helper.response(false, "You are not Admin authorized to add promotion", {}, res, 200);
        }
        const {code, discount, startDate, endDate,type,description,status} = req.body
        const promotion = await Promotions.create({
            code:code,
            discountValue:discount,
            startDate:startDate,
            endDate:endDate,
            discountType:type,
            description:description,
            is_active:status
        })
        if(!promotion){
            return Helper.response(false, "Promotion not created", {}, res,200);
        }
        return Helper.response(true, "Promotion created successfully!", {}, res, 200);

    }catch(err){
        return Helper.response(false,err.message, {}, res, 200);
    }

}

exports.promotionList = async(req,res)=>{
    try{
        const promotion = await Promotions.findAll({
            attributes: ['id','code','discountValue','startDate','endDate','discountType','description','is_active'],
        })


        

        if(!promotion){
            return Helper.response(false, "Promotion not found", {}, res,200);
        }
        const formattedPromotions = promotion.map(promo => ({
            ...promo.toJSON(),
            startDate: Helper.formatDate(promo.startDate),
            endDate: Helper.formatDate(promo.endDate),
        }));
        return Helper.response(true, "Promotion List found successfully!",formattedPromotions, res, 200);

    }catch(err){
        return Helper.response(false,err.message, {}, res, 200);
    }

}

exports.updatePromotion = async(req,res)=>{
    try{
        if(req.users.role !== "admin") {
            return Helper.response(false, "You are not Admin authorized to update promotion", {}, res, 200);
        }
        const {id} = req.body

        const {code, discount, startDate, endDate,type,description,status} = req.body
        const updateData = {
            code:code,
            discountValue:discount,
            startDate:startDate,
            endDate:endDate,
            discountType:type,
            description:description,
            is_active:status
        }
        const promotion = await Promotions.update(updateData,{
            where:{
                id:id
            }
        })
        if(!promotion){
            return Helper.response(false, "Promotion not updated", {}, res,200);
        }
        return Helper.response(true, "Promotion updated successfully!", {}, res, 200);

    }catch(err){
        return Helper.response(false,err.message, {}, res, 200);
    }
}

exports.deletePromotion = async(req,res)=>{
    try{
        if(req.users.role !== "admin") {
            return Helper.response(false, "You are not Admin authorized to delete promotion", {}, res, 200);
        }
        const {id} = req.body
        const promotion = await Promotions.destroy({
            where:{
                id:id
            }
        })
        if(!promotion){
            return Helper.response(false, "Promotion not deleted", {}, res,200);
        }
        return Helper.response(true, "Promotion deleted successfully!", {}, res, 200);

    }catch(err){
        return Helper.response(false,err.message, {}, res, 200);
    }
}

exports.promotionById = async(req,res)=>{
    try{
        const {id} = req.body
        const promotion = await Promotions.findOne({
            where:{
                id:id
            }
        })
        if(!promotion){
            return Helper.response(false, "Promotion not found", {}, res,200);
        }
        return Helper.response(true, "Promotion found successfully!", promotion, res, 200);

    }catch(err){
        return Helper.response(false,err.message, {}, res, 200);
    }
}



exports.userList = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.body.search ? req.body.search.trim() : "";

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { mobile: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const userData = await users.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    //   order: [['createdAt', 'DESC']]
    });

    const totalRecords = await users.count()

    return Helper.response(true, 'User List Found Successfully', {
      total: userData.count,
      page,
      totalPages: Math.ceil(userData.count / limit),
      users: userData.rows,
      totalRecords:totalRecords
    }, res, 200);

  } catch (err) {
    console.error(err);
    return Helper.response(false, err.message, {}, res, 500);
  }
};

exports.slotList = async(req,res)=>{
    try{
        const {doctorId} = req.body
        const data = await doctorsAvailability.findAll({
            where:{
                doctorId:doctorId
            }
          
        })
        const grouped = Object.values(
            data.reduce((acc, item) => {
              if (!acc[item.doctorId]) {
                acc[item.doctorId] = {
                  doctorId: item.doctorId,
                  slots: []
                };
              }
              acc[item.doctorId].slots.push({
                id: item.id,
                dayOfWeek: item.dayOfWeek,
                startTime: item.startTime,
                endTime: item.endTime,
                fee: item.fee,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
              });
              return acc;
            }, {})
          );
          
       
          
        return Helper.response(true, "data found successfully!",grouped, res, 200);


    }catch(err){
        return Helper.response(false,err.message, {}, res, 200);
    }
}
