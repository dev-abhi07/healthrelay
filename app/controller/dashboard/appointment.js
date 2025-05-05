const moment = require("moment");
const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const doctorsAvailability = require("../../models/doctorsAvailability");
const booking = require("../../models/booking");
const { Op, fn, where, col } = require("sequelize");
const path = require("path");
const meeting = require("../../models/meeting");
const doctors = require("../../models/doctors");
const Prescription = require("../../models/prescriptions");
const users = require("../../models/users");

// exports.addAppointment = async (req, res) => {
//   try {
//     const schedule = req.body;
//     console.log("Schedule data:", schedule);
//     const slotsToSave = [];

//     for (const dayData of schedule) {
//       const { day, from_time, to_time, fees, doctor_id, duration } = dayData;
//       if (!from_time || !to_time || !duration) {
//         console.log(
//           `Skipping day ${dayData.day_name} — missing time or duration`
//         );
//         continue;
//       }

//       const slotDuration = Helper.parseDuration(duration);
//       let start = moment(from_time, "HH:mm");
//       const end = moment(to_time, "HH:mm");

//       if (start >= end || slotDuration <= 0) continue;

//       while (start.clone().add(duration, "minutes") <= end) {
//         const slotStart = start.format("HH:mm");
//         const slotEnd = start
//           .clone()
//           .add(slotDuration, "minutes")
//           .format("HH:mm");

//         slotsToSave.push({
//           doctorId: doctor_id,
//           dayOfWeek: day,
//           startTime: slotStart,
//           endTime: slotEnd,
//           fee: parseInt(fees) || 0,
//         });
//         start.add(slotDuration, "minutes");
//       }
//     }

//     if (!slotsToSave.length) {
//       return Helper.response(
//         false,
//         "No valid slots found to save.",
//         {},
//         res,
//         200
//       );
//     }
//     const created = await doctorsAvailability.bulkCreate(slotsToSave);
//     return Helper.response(true, "Slot created successfully!", {}, res, 200);
//   } catch (error) {
//     console.log(error);
//     return Helper.response(false, error.message, {}, res, 500);
//   }
// };



exports.addAppointment = async (req, res) => {
  try {
    const schedule = req.body;
    console.log("Schedule data:", schedule);

    const slotsToSave = [];

    for (const dayData of schedule) {
      const { day, from_time, to_time, fees, doctor_id,duration } = dayData;

      if (!from_time || !to_time || !doctor_id) {
        console.log(`Skipping day ${dayData.day_name} — missing required fields`);
        continue;
      }

      const start = moment(from_time, "HH:mm");
      const end = moment(to_time, "HH:mm");

      if (!start.isValid() || !end.isValid() || start >= end) {
        console.log(`Invalid time range for day ${dayData.day_name}`);
        continue;
      }

      slotsToSave.push({
        doctorId: doctor_id,
        dayOfWeek: day,
        startTime: start.format("HH:mm:ss"),
        endTime: end.format("HH:mm:ss"),
        fee: parseInt(fees) || 0,
        slotDuration:parseInt(duration)
      });
    }

    if (!slotsToSave.length) {
      return Helper.response(false, "No valid availabilities found to save.", {}, res, 200);
    }

    await doctorsAvailability.bulkCreate(slotsToSave);
    return Helper.response(true, "Doctor availability added successfully!", {}, res, 200);

  } catch (error) {
    console.log("Add appointment error:", error);
    return Helper.response(false, error.message, {}, res, 500);
  }
};


exports.meetingsToken = async (req, res) => {
try{
 
  let userData
  if(req.body.role === 'doctor'){
    userData = await users.findOne({
      where:{
        id:req.body.data.userId
      },
      attributes:['id','name','deviceToken']
    })
  }else if(req.body.role === 'user'){
    userData = await users.findOne({
      where:{
        id:req.body.data.doctorId
      },
      attributes:['id','name','deviceToken']
    })

  }else{
    return Helper.response(false, "Invalid role", {}, res, 200);
  }
  await Helper.sendPushNotification(
    userData.deviceToken,
    "Meeting Reminder",
    "You have a meeting scheduled.",
    {
      meetingId: req.body.data.id,
      doctorId: req.body.data.doctorId,
      doctorName: req.body.data.doctorName,
      startTime: req.body.data.startTime,
      patientName: req.body.data.patientName,
      status: req.body.data.status,
      prescription: req.body.data.prescription,
      isShow: req.body.data.isShow,
      appointment_num: req.body.data.appointment_num,
      role: req.body.role,
      age: req.body.data.age,
      symptoms: req.body.data.symptoms,
      endTime: req.body.data.endTime,
    }
  );
  return Helper.response(true, "data found successfully!",userData, res, 200);
  

}catch(err){
  console.log(err)
  return Helper.response(false, err.message, {}, res, 500);
}
};






exports.bookAppointment = async (req, res) => {
  let transaction;

  try {
    const { date, slotStart, fee, doctor_id, name, gender, email,symptoms} = req.body;
    // if (!date || !slotStart || !fee || !doctor_id || !name || !email) {
    //   return Helper.response(
    //     false,
    //     "All fields (date, slotStart, fee, doctor_id, name, email) are required",
    //     {},
    //     res,
    //     200
    //   );
    // }
    const medicineData = JSON.parse(req.body.medicineData || '[]');
    const prescriptions = [];


    const appointment_num = Helper.generateAppointmentNum();
    const UPLOAD_ROUTE = "upload";
    let imageName = null;

    const documents = req.files ? req.files.map(file => `${UPLOAD_ROUTE}/${file.filename}`) : [];
    const diagnosisData = JSON.parse(req.body.diagnosis || '[]');
    const combinedDiagnosis = diagnosisData.map(item => item.diagnosis).join(", ") || '';

   
    if (req.files && req.files[0]) {
      const image = req.files[0];
      imageName = path.basename(image.path);
    }

    const startTime = moment(slotStart, "HH:mm:ss");
    const endTime = startTime.clone().add(30, "minutes").format("HH:mm:ss");

    const existingBooking = await booking.findOne({
      where: {
        doctorId: doctor_id,
        [Op.and]: [
          where(fn("DATE", col("date")), date),
          { startTime: startTime.format("HH:mm:ss") },
          { endTime: endTime },
          { status: true },
        ],
      },
    });

    if (existingBooking) {
      return Helper.response(
        false,
        "This slot is already booked. Please choose another slot.",
        {},
        res,
        200
      );
    }

    transaction = await sequelize.transaction();

    const doctorData = await doctors.findOne({
      where: {
        id: doctor_id,
      },
      attributes: ["name"],

    },{
      transaction,
    })

    const appointment = await booking.create(
      {
        doctorId: doctor_id,
        date: date,
        gender: gender || null,
        email: email,
        startTime: startTime.format("HH:mm:ss"),
        endTime: endTime,
        fee: fee,
        image: imageName ? `${UPLOAD_ROUTE}/${imageName}` : null,
        userId: req.users.id,
        status: true,
        patientName: name,
        symptoms: symptoms || null,
        appointment_num: appointment_num,
      },
      {
        transaction,
      }
    );

    await meeting.create(
      {
        userId: req.users.id,
        doctorId: doctor_id.trim(),
        bookingId: appointment.id,
        appointment_num: appointment_num,
        date: date,
        startTime: startTime.format("HH:mm:ss"),
        endTime: endTime,
        symptoms: symptoms || null,
        

      },
      {
        transaction,
      }
    );

    for (let i = 0; i < medicineData.length; i++) {
      const item = medicineData[i];

      prescriptions.push({
        doctorId:req.users.id,
        userId:req.users.id,
        medicineName: item.medicinename,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.notes || '',
        document: documents,
        diagnosis:combinedDiagnosis,
       
      });
    }

 await Prescription.bulkCreate(prescriptions,{
  transaction
 });
  


    await transaction.commit();
    return Helper.response(
      true,
      "Appointment booked successfully!",
      {...appointment.toJSON(), doctorName: doctorData.name},

      res,
      200
    );
  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error in booking appointment:", err);
    return Helper.response(false, err.message, {}, res, 500);
  }
};

exports.appointmentList = async (req, res) => {

  try {
    const userId = req.users.id;
    let allMeetings
    
    if(req.users.role === 'admin'){
      allMeetings = await meeting.findAll({
        order:[['createdAt','DESC']]
      });
    }
    else{
      allMeetings = await meeting.findAll({
        where: {
          [Op.or]: [
            { userId: userId },
            { doctorId: userId }
          ]
        },
        order:[['createdAt','DESC']]
      });
    }
    
    const doctorIds = [...new Set(allMeetings.map(m => m.doctorId))];
    const userIds = [...new Set(allMeetings.map(m => m.userId))];
    
    const doctorDetails = await doctors.findAll({
      where: { id: { [Op.in]: doctorIds } }
    });

    const userDetails = await users.findAll({
      where: { id: { [Op.in]: userIds } } 
    })






    
    
    const doctorMap = {};
    doctorDetails.forEach(doc => {
      doctorMap[doc.id] = {
        name: doc.name,
        designation: doc.designation,
        department: doc.dept_name,
        image: doc.doctor_img,
        fees:doc.fees,
      };
    });

    const userMap = {};
    userDetails.forEach(user => {
      userMap[user.id] = {
        name: user.name,
        date_of_birth: user.date_of_birth,
        gender:user.gender
      }
    });
    
    const today = moment().startOf("day");
    const tomorrow = moment().add(1, "day").startOf("day");
    
    const formatted = {
      upcoming: [],
      completed: []
    };
    
    for (const meet of allMeetings) {
      const meetingDate = moment(meet.date).startOf("day");
      const currentDate = moment().startOf("day");
      if (meetingDate.isBefore(currentDate) && meet.status === 'upcoming') {
        await meeting.update({ status: 'completed' }, { where: { id: meet.id } });
        meet.status = 'completed'; 
      }
      let formattedDate;
    
      if (meetingDate.isSame(today)) {
        formattedDate = `Today (${meetingDate.format("YYYY-MM-DD")})`;
      } else if (meetingDate.isSame(tomorrow)) {
        formattedDate = `Tomorrow (${meetingDate.format("YYYY-MM-DD")})`;
      } else {
        formattedDate = meetingDate.format("YYYY-MM-DD");
      }
    
      let age = null;
      if (userMap[meet.userId]?.date_of_birth) {
        const dob = new Date(userMap[meet.userId].date_of_birth);
        const todayDate = new Date();
        age = todayDate.getFullYear() - dob.getFullYear();
        const m = todayDate.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && todayDate.getDate() < dob.getDate())) {
          age--;
        }
      }
    
      const prescription = await Prescription.findAll({
        where: {
          doctorId: meet.doctorId,
          userId: meet.userId,
        },
        attributes: ['medicineName', 'dosage', 'frequency', 'duration', 'instructions', 'document', 'diagnosis'],
      });
    
   
    
      const data = {
        ...meet.toJSON(),
        patientName: userMap[meet.userId]?.name || '',
        date: formattedDate,
        date_of_birth: userMap[meet.userId]?.date_of_birth || null,
        age: age,
        gender: userMap[meet.userId]?.gender || null,
        name: doctorMap[meet.doctorId]?.name || '',
        designation: doctorMap[meet.doctorId]?.designation || '',
        dept_name: doctorMap[meet.doctorId]?.department || '',
        fees: doctorMap[meet.doctorId]?.fees || '',
        doctor_img: doctorMap[meet.doctorId]?.image || '',
        prescription: prescription || null,
      };
    
      if (meet.status === 'upcoming') {
        formatted.upcoming.push(data);
      } else if (meet.status === 'completed') {
        formatted.completed.push(data);
      }
    }
    
    return Helper.response(true, "Meeting details", formatted, res, 200);

    
  
  } catch (err) {
    console.log(err);
    return Helper.response(false, err.message, {}, res, 500);
  }
};

exports.totalSlots = async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) {
      return Helper.response(false, "Doctor ID is required", {}, res, 200);
    }

    const today = moment().startOf("day");
    const results = [];

    for (let i = 0; i < 7; i++) {
      const date = today.clone().add(i, "days");
      const formattedDate = date.format("YYYY-MM-DD");
      const dayOfWeek = date.isoWeekday();

      const availabilities = await doctorsAvailability.findAll({
        where: {
          doctorId,
          dayOfWeek: dayOfWeek
        }
      });

      if (!availabilities.length) {
        results.push({
          date: i === 0
            ? `Today, ${date.format("D MMMM")}`
            : i === 1
            ? `Tomorrow, ${date.format("D MMMM")}`
            : `${date.format("dddd")}, ${date.format("D MMMM")}`,
          date1: formattedDate,
          totalSlots: 0,
          availableSlots: 0,
          bookedSlots: 0,
          slots: []
        });
        continue;
      }

   
      const bookings = await booking.findAll({
        where: {
          doctorId,
          [Op.and]: [
            where(fn("DATE", col("date")),formattedDate),
            { status: true },
          ],
        }
      });

    



      const bookedStartTimes = bookings.map((b) =>
        moment(b.startTime, "HH:mm:ss").format("HH:mm")
      );

      const allSlots = [];

      for (const availability of availabilities) {
        const start = moment(`${formattedDate} ${availability.startTime}`);
        const end = moment(`${formattedDate} ${availability.endTime}`);
        const slotDuration = availability.slotDuration || 30;
      
        let current = start.clone();
      
        while (current < end) {
          const slotStart = current.clone();
          const slotLabel = slotStart.format("hh:mm A");
          const slotKey = slotStart.format("HH:mm");
      
          const available = !bookedStartTimes.includes(slotKey);
      
          allSlots.push({
            time: slotLabel,
            available
          });
      
          current.add(slotDuration, "minutes");
        }
      }
      

      const totalSlots = allSlots.length;
      const bookedSlots = allSlots.filter((s) => !s.available).length;
      const availableSlots = totalSlots - bookedSlots;

      let label;
      if (i === 0) {
        label = `Today, ${date.format("D MMMM")}`;
      } else if (i === 1) {
        label = `Tomorrow, ${date.format("D MMMM")}`;
      } else {
        label = `${date.format("dddd")}, ${date.format("D MMMM")}`;
      }

      results.push({
        date: label,
        date1: formattedDate,
        totalSlots,
        availableSlots,
        bookedSlots,
        slots: allSlots
      });
    }

    return Helper.response(
      true,
      "Slot summary for next 7 days",
      results,
      res,
      200
    );
  } catch (error) {
    console.log(error);
    return Helper.response(false, error.message, {}, res, 500);
  }
};

exports.bookingDetails = async (req, res) => {
  try {
    if(req.users.role === 'admin'){
      const details = await booking.findAll();

      if (!details) {
        return Helper.response(false, "No booking found", {}, res, 200);
      }
      const doctorIds = [...new Set(details.map(m => m.doctorId))];
           
      const doctorDetails = await doctors.findAll({
        where: { id: { [Op.in]: doctorIds } }
      });
      const doctorMap = {};
      doctorDetails.forEach(doc => {
        doctorMap[doc.id] = {
          name: doc.name,
          designation: doc.designation,
          department: doc.dept_name,
          image: doc.doctor_img
        };
      });
      const formatted = details.map(meet => {
        return {
          ...meet.toJSON(),
          doctorName: doctorMap[meet.doctorId]?.name || '',
          designation: doctorMap[meet.doctorId]?.designation || '',
          department: doctorMap[meet.doctorId]?.department || '',
          image: doctorMap[meet.doctorId]?.image || '',
        };
      });
      return Helper.response(true, "Booking details", formatted, res, 200);
    }
    return Helper.response(false, "You are not authorized to view this data", {}, res, 200);
  } catch (err) {
    console.log(err);
    return Helper.response(false, err.message, {}, res, 500);
  }
};

exports.upcomingMeetings = async (req, res) => {
   try{
    const userId = req.users.id;
    const today = moment().startOf("day");

    const upcomingMeetings = await meeting.findAll({
      where: {
        [Op.or]: [
          { userId: userId },
          { doctorId: userId }
        ],
        [Op.and]: [
          where(fn("DATE", col("date")), {
            [Op.eq]: today.format("YYYY-MM-DD"),
          }),
          { status: "upcoming" },
        ],
      },
    
    });

    if (!upcomingMeetings.length) {
      return Helper.response(false, "No upcoming meetings found", {}, res, 200);
    }


    const doctorIds = [...new Set(upcomingMeetings.map(m => m.doctorId))];
    const userIds = [...new Set(upcomingMeetings.map(m => m.userId))];
    const userDetails = await users.findAll({
      where: { id: { [Op.in]: userIds } }
    });
           
    const doctorDetails = await doctors.findAll({
      where: { id: { [Op.in]: doctorIds } }
    });
    const doctorMap = {};
    doctorDetails.forEach(doc => {
      doctorMap[doc.id] = {
        name: doc.name,
        designation: doc.designation,
        department: doc.dept_name,
        image: doc.doctor_img
      };
    });
    const userMap = {};
    userDetails.forEach(user => {
      userMap[user.id] = {
        name: user.name,
        date_of_birth: user.date_of_birth,
        gender:user.gender
      }
    })
    const formattedMeetings = await Promise.all(upcomingMeetings.map(async (meet) => {
      const meetingDate = moment(meet.date).startOf("day");
      let formattedDate;
    
      if (meetingDate.isSame(today)) {
        formattedDate = `Today (${meetingDate.format("YYYY-MM-DD")})`;
      } else {
        formattedDate = meetingDate.format("YYYY-MM-DD");
      }

      const prescription = await Prescription.findAll({
        where: {
         doctorId: meet.doctorId,
         userId: meet.userId,
        },
        attributes: ['medicineName', 'dosage', 'frequency', 'duration', 'instructions',"document", 'diagnosis'],
      });
      let age = null;
      if (userMap[meet.userId]?.date_of_birth) {
        const dob = new Date(userMap[meet.userId].date_of_birth);
        const today = new Date();
        age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
      }

    
      return {
        ...meet.toJSON(),
        date: formattedDate,
        doctorName: doctorMap[meet.doctorId]?.name || '',
        patientName: userMap[meet.userId]?.name || '',
        gender:userMap[meet.userId]?.gender || null,
        age: age,
        date_of_birth: userMap[meet.userId]?.date_of_birth || null,
        designation: doctorMap[meet.doctorId]?.designation || '',
        department: doctorMap[meet.doctorId]?.department || '',
        image: doctorMap[meet.doctorId]?.image || '',
        prescription:prescription || null,
      };
    }));

    return Helper.response(true, "Upcoming meetings",formattedMeetings, res, 200);

   }catch(err){
    return Helper.response(false, err.message, {}, res, 500);
   }
}
