const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const Department = require("../../models/department");
const disease = require("../../models/disease");
const specialization = require("../../models/specialization");


exports.createDisease = async (req,res) => {
    try {
        const { name } = req.body
        const diseases = await disease.create({
            name:name
        })
        if(!diseases){
            return Helper.response(false, "Disease not created", {}, res,200);
        }

        return Helper.response(true, "Disease created successfully!", {}, res, 200);
    } catch (error) {
        console.log(error)
        return Helper.response(false, "Server Error", {}, res, 200);
    }
}
exports.diseaseList = async (req,res) => {
    try {
     
        const diseases = await disease.findAll()
        return Helper.response(true, "Disease List found successfully!", {diseases}, res, 200);
    } catch (error) {
        console.log(error)
        return Helper.response(false, "Server Error", {}, res, 200);
    }
}

exports.updateDisease = async(req,res)=>{
    try{
        const {id,name}=req.body
        const updateData = {
            name:name
        }
        const diseases = await disease.update(updateData,{where:{id:id}})
        if(!diseases){
            return Helper.response(false, "Disease not found", {}, res,200);
        }
        return Helper.response(true, "Disease updated successfully!", {}, res, 200);

    }catch(err){
        return Helper.response(false, err.message, {}, res, 200);
    }
}

exports.deleteDisease = async(req,res)=>{
    try{
        const {id}=req.body
        const diseases = await disease.destroy({where:{id:id}})
        if(!diseases){
            return Helper.response(false, "Disease not found", {}, res,200);
        }
        return Helper.response(true, "Disease deleted successfully!", {}, res, 200);

    }catch(err){
        return Helper.response(false, err.message, {}, res, 200);
    }
}

exports.diseaseListDD = async(req,res)=>{
    try{
        const result = await disease.findAll()
        if(!result){
            return Helper.response(false, "Disease not found", {}, res, 200);
        }
        const data = await Promise.all(
            result.map((item) =>(
                {
                    value:item.id,
                    label:item.name
                }
            ) 
        ))
        return Helper.response(true, "Disease List found successfully!",data, res,200)

    }catch(err){
        return Helper.response(false, err.message, {}, res, 200);
    }
}

//department Master
exports.createDepartment = async (req,res) => {
    try {
        const { name } = req.body
        if(req.users.role !== "admin"){
            return Helper.response(false, "You are not authorized to create department", {}, res, 200);
        }
        const departmentData = await Department.create({
            name:name
        })
        if(!departmentData){
            return Helper.response(false, "Department not created", {}, res,200);
        }
        return Helper.response(true, "Department created successfully!",departmentData, res, 200);
    } catch (error) {
        console.log(error)
        return Helper.response(false,err.message, {}, res, 200);
    }
}

exports.departmentListDD = async (req,res) => {
    try {
        if(req.users.role !== "admin"){
            return Helper.response(false, "You are not authorized to create department", {}, res, 200);
        }
        const departmentData = await Department.findAll()
        if(departmentData.length === 0){
            return Helper.response(false, "Department not found", {}, res,200);
        }
        const data = await Promise.all(
            departmentData.map((item) =>(
                {
                    value:item.id,
                    label:item.name
                }
            ) 
        ))
        return Helper.response(true, "Department List found successfully!",data, res, 200);
    } catch (error) {
        console.log(error)
        return Helper.response(false, error.message, {}, res, 200);
    }
}

exports.updateDepartment = async(req,res)=>{
    try{
        const {id,name}=req.body
        if(req.users.role !== "admin"){
            return Helper.response(false, "You are not authorized to create department", {}, res, 200);
        }
        const updateData = {
            name:name
        }
        const departmentData = await Department.update(updateData,{where:{id:id}})
        if(!departmentData){
            return Helper.response(false, "Department not found", {}, res,200);
        }
        return Helper.response(true, "Department updated successfully!", {}, res, 200);

    }catch(err){
        return Helper.response(false, err.message, {}, res, 200);
    }
}

exports.deleteDepartment = async(req,res)=>{
    try{
        if(req.users.role !== "admin"){
            return Helper.response(false, "You are not authorized to create department", {}, res, 200);
        }
        const {id}=req.body
        const departmentData = await Department.destroy({where:{id:id}})
        if(!departmentData){
            return Helper.response(false, "Department not found", {}, res,200);
        }
        return Helper.response(true, "Department deleted successfully!", {}, res, 200);

    }catch(err){
        return Helper.response(false, err.message, {}, res, 200);
    }
}

exports.departmentList = async (req,res) => {
    try {
        if(req.users.role !== "admin"){
            return Helper.response(false, "You are not authorized to create department", {}, res, 200);
        }
        const departmentData = await Department.findAll()
        if(departmentData.length === 0){
            return Helper.response(false, "Department not found", {}, res,200);
        }
        return Helper.response(true, "Department List found successfully!",departmentData, res, 200);
    } catch (error) {
        console.log(error)
        return Helper.response(false, err.message, {}, res, 200);
    }
}
