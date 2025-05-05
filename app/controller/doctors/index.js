const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const doctors = require("../../models/doctors");
const Prescription = require("../../models/prescriptions");
const path = require("path");
const specialization = require("../../models/specialization");
const Department = require("../../models/department");
const { Op } = require("sequelize");
const disease = require("../../models/disease");
const DoctorProfile = require("../../models/doctorProfile");

exports.doctors = async(req,res) => {
    try {
        if(req.users.role !== "admin") {
            return Helper.response(false, "You are not authorized to view doctors", {}, res, 200);
        }
        
        const doctorsData = await doctors.findAll()
        if(!doctorsData || doctorsData.length === 0) {
            return Helper.response(true, "No Record Found!", null, res, 200);
        }

        const data = await Promise.all(
            doctorsData.map(async (doctor) => {
              let departmentsList = [];
              let specializationList = [];
              let diseaseList = [];
              if (doctor.diseaseId && doctor.diseaseId.length > 0) {
                diseaseList = await disease.findAll(
                    {
                        where: {
                        id: {
                            [Op.in]: doctor.diseaseId,
                        },
                        },
                        attributes: ["id", "name"],
                    }
                )
              }
                if (doctor.specialization && doctor.specialization.length > 0) {
                    specializationList = await specialization.findAll({
                        where: {
                        id: {
                            [Op.in]: doctor.specialization,
                        },
                        },
                        attributes: ["id", "specialization"],
                    });
                }
          
              if (doctor.departmentId && doctor.departmentId.length > 0) {
                departmentsList = await Department.findAll({
                  where: {
                    id: {
                      [Op.in]: doctor.departmentId, 
                    },
                  },
                  attributes: ["id", "name"],
                });
              }
          
              return {
                ...doctor.dataValues,
                department: departmentsList.length
                  ? departmentsList.map((dept) => dept.name)
                  : null,
                specialization: specializationList.length
                  ? specializationList.map((spec) => spec.specialization)
                  : null,
                disease: diseaseList.length
                  ? diseaseList.map((disease) => disease.name)
                  : null,
              };
            })
          );
          
        return Helper.response(true, "Data found successfully!",data, res, 200);
    } catch (error) {
        console.log(error)
        return Helper.response(false, null, {error}, res, 200);
    }
}

exports.doctorListDD = async(req,res)=>{
    try{
        if(req.users.role !== "admin"){
            return Helper.response(false, "You are not authorized to view doctors", {}, res, 200);
        }
        const doctorList = await doctors.findAll()
        if(!doctorList){
            return Helper.response(true, "No Record Found!", null, res, 200);
        }
        const data = await Promise.all(
            doctorList.map(async (doctor) => (
                {
                    value: doctor.id,
                    label: doctor.name
                }
            )
        ))

        return Helper.response(true, " Record Found successfully",data, res, 200);



    }catch(err){
        return Helper.response(false,err.message, {}, res, 200);
    }
}


exports.AddPrescription = async (req, res) => {
    try {
      const UPLOAD_ROUTE = "upload";
  
      const { userId} = req.body;
  
      const medicineData = JSON.parse(req.body.medicineData || '[]');
      const diagnosisData = JSON.parse(req.body.diagnosis || '[]');
  
      const documents = req.files ? req.files.map(file => `${UPLOAD_ROUTE}/${file.filename}`) : [];
  
      const prescriptions = [];
      const combinedDiagnosis = diagnosisData.map(item => item.diagnosis).join(", ") || '';
  
      for (let i = 0; i < medicineData.length; i++) {
        const item = medicineData[i];
  
        prescriptions.push({
          doctorId:req.users.id,
          userId,
          medicineName: item.medicinename,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          instructions: item.notes || '',
          document: documents,
          diagnosis:combinedDiagnosis,
        });
      }
  
      const savedPrescriptions = await Prescription.bulkCreate(prescriptions);
  
      return Helper.response(true, "Prescriptions added successfully", savedPrescriptions, res, 200);
  
    } catch (err) {
      console.error("Prescription error:", err);
      return Helper.response(false, err.message, {}, res, 500);
    }
  };
  


exports.getPrescription = async (req, res) => {
    try {
        const { doctorId, userId } = req.body;
        const prescriptions = await Prescription.findAll({
            where: {
                doctorId,
                userId
            }
        });
        if (!prescriptions) {
            return Helper.response(true, "No Record Found!", null, res, 200);
        }
        return Helper.response(true, "Record Found successfully", prescriptions, res, 200);
    } catch (err) {
        return Helper.response(false, err.message, {}, res, 500);
    }
}

exports.createDoctor = async (req, res) => {
    try {
        if (req.users.role !== "admin") {
            return Helper.response(false, "You are not authorized to create doctor", {}, res, 200);
        }
        const UPLOAD_ROUTE = "upload";

        const { name, phone, email, degree, designation, specialization, fees, dept_name,disease } = req.body;

        const parsedSpecialization = specialization
            ? typeof specialization === "string"
                ? specialization.includes("[")
                    ? JSON.parse(specialization)
                    : specialization.split(",").map(item => item.trim())
                : []
            : [];

        const parsedDeptName = dept_name
            ? typeof dept_name === "string"
                ? dept_name.includes("[")
                    ? JSON.parse(dept_name)
                    : dept_name.split(",").map(item => item.trim())
                : []
            : [];

        const parsedDisease = disease
            ? typeof disease === "string"
                ? disease.includes("[")
                    ? JSON.parse(disease)
                    : disease.split(",").map(item => item.trim())
                : []
            : [];

            let imageName = null;

       if (req.files && req.files[0]) {
            const doctor_img = req.files[0];
            imageName = path.basename(doctor_img.path);
          }

        const doctor = await doctors.create({
            name,
            phone,
            email,
            degree,
            designation,
            specialization: parsedSpecialization,
            departmentId: parsedDeptName,
            doctor_img:`${process.env.BASE_URL}${UPLOAD_ROUTE}/${imageName}`,
            fees,
            diseaseId: parsedDisease,
        });

        return Helper.response(true, "Doctor Created successfully", doctor, res, 200);

    } catch (err) {
        console.log(err);
        return Helper.response(false, err.message, {}, res, 200);
    }
};




exports.bulkInsertDoctors = async (req, res) => {
  try {
    const {doctors}= req.body;


    if (!Array.isArray(doctors) || doctors.length === 0) {
      return res.status(400).json({ message: "Invalid or empty input array" });
    }

    await DoctorProfile.bulkCreate(doctors,{
        ignoreDuplicates: true,
    })

    res.status(200).json({ message: `${doctors.length} records inserted/updated successfully` });
  } catch (error) {
    console.error('Bulk insert error:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


  