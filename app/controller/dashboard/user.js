const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const Address = require("../../models/address");
const City = require("../../models/city");
const HelpCenter = require("../../models/help");
const State = require("../../models/state");

const sanitizeFloat = (value) => {
  if (value === "" || value === undefined || value === null) {
    return null;
  }
  return parseFloat(value);
};

exports.bookConsultation = async (req, res) => {
  //search disease than list show doctors based on it
};

exports.createAddress = async (req, res) => {
  try {
    const userId = req.users.id;

    const {
      address,
      city,
      state,
      postalCode,
      type,
      latitude,
      longitude,
      mobile,
      name,
    } = req.body;
    const addressData = await Address.create({
      name: name,
      userId,
      addressLine1: address,
      city,
      state,
      postalCode,
      type,
      latitude: sanitizeFloat(latitude),
      longitude: sanitizeFloat(longitude),
      mobile,
    });
    if (!addressData) {
      return Helper.response(false, "Address not created", {}, res, 200);
    }
    return Helper.response(
      true,
      "Address created successfully",
      addressData,
      res,
      200
    );
  } catch (err) {
    console.log(err);
    return Helper.response(false, err.message, {}, res, 500);
  }
};

exports.stateListDD = async (req, res) => {
  try {
    const stateData = await State.findAll();
    if (!stateData) {
      return Helper.response(false, "State not found", {}, res, 200);
    }
    const data = await Promise.all(
      stateData.map(async (state) => {
        return {
          value: state.id,
          label: state.name,
        };
      })
    );
    return Helper.response(
      true,
      "State List found successfully!",
      data,
      res,
      200
    );
  } catch (err) {
    console.log(err);
    return Helper.response(false, err.message, {}, res, 500);
  }
};

exports.cityListDD = async (req, res) => {
  try {
    const { stateId } = req.body;
    const cityData = await City.findAll({
      where: {
        stateId: stateId,
      },
    });
    console.log("cityData", cityData);
    if (!cityData) {
      return Helper.response(false, "City not found", {}, res, 200);
    }
    const data = await Promise.all(
      cityData.map(async (city) => {
        return {
          value: city.id,
          label: city.name,
        };
      })
    );
    return Helper.response(
      true,
      "City List found successfully!",
      data,
      res,
      200
    );
  } catch (err) {
    console.log(err);
    return Helper.response(false, err.message, {}, res, 500);
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const userId = req.users.id;
    const {
      id,
      address,
      city,
      state,
      postalCode,
      type,
      latitude,
      longitude,
      mobile,
      name,
    } = req.body;
    const updateData = {
      name: name,
      userId,
      addressLine1: address,
      city,
      state,
      postalCode,
      type,
      latitude: sanitizeFloat(latitude),
      longitude: sanitizeFloat(longitude),

      mobile,
    };
    const addressData = await Address.update(updateData, {
      where: {
        id: id,
      },
    });
    if (!addressData) {
      return Helper.response(false, "Address not updated", {}, res, 200);
    }
    return Helper.response(
      true,
      "Address updated successfully",
      addressData,
      res,
      200
    );
  } catch (err) {
    console.log(err);
    return Helper.response(false, err.message, {}, res, 500);
  }
};

exports.addressList = async (req, res) => {
  try {
    const userId = req.users.id;
    const addressData = await Address.findAll({
      where: {
        userId: userId,
      },
    });
    if (!addressData) {
      return Helper.response(false, "Address not found", {}, res, 200);
    }
    return Helper.response(
      true,
      "Address List found successfully!",
      addressData,
      res,
      200
    );
  } catch (err) {
    console.log(err);
    return Helper.response(false, err.message, {}, res, 500);
  }
};

exports.helpCenter = async(req,res)=>{
  try{
  const {name,mobile,message} = req.body
  const data = await HelpCenter.create({
    name:name,
    mobile:mobile,
    message:message,
    userId:req.users.id
  })
  if(!data){
    return Helper.response(false,'Help is not assign for this user',{},res,200)
  }
  return Helper.response(true,'your message is send to Help center',data,res,200)
  }catch(err){
   
    return Helper.response(false,err.message,{},res,200)

  }
}
