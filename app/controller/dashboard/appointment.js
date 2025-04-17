const moment = require("moment");
const sequelize = require("../../connection/sequelize");
const Helper = require("../../helper/helper");
const doctorsAvailability = require("../../models/doctorsAvailability");


exports.addAppointment = async (req, res) => {
    try {
        const schedule = req.body;
        const slotsToSave = [];

        for (const dayData of schedule) {
            const { day, from_time, to_time, fees, doctor_id, duration } = dayData;
            if (!from_time || !to_time || !duration) {
                console.log(`Skipping day ${dayData.day_name} — missing time or duration`);
                continue;
            }

            const slotDuration = Helper.parseDuration(duration);
            let start = moment(from_time, 'HH:mm');
            const end = moment(to_time, 'HH:mm');

            if (start >= end || slotDuration <= 0) continue;

            while (start.clone().add(duration, 'minutes') <= end) {
                const slotStart = start.format('HH:mm');
                const slotEnd = start.clone().add(slotDuration, 'minutes').format('HH:mm');
                slotsToSave.push({
                    doctorId: doctor_id,
                    dayOfWeek: day,
                    startTime: slotStart,
                    endTime: slotEnd,
                    fee: parseInt(fees) || 0
                });
                start.add(slotDuration, 'minutes');
            }
        }

        if (!slotsToSave.length) {
            return Helper.response(false, "No valid slots found to save.", {}, res, 200);
        }
        const created = await doctorsAvailability.bulkCreate(slotsToSave);
        return Helper.response(true, "Slot created successfully!", {}, res, 200);
    } catch (error) {
        console.log(error)
    }
}