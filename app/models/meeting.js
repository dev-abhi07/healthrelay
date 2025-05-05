const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");

const meeting = sequelize.define("meeting", {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  bookingId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  appointment_num: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("upcoming", "completed", "cancelled"),
    defaultValue: "upcoming",
  },
  symptoms: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// meeting.sync({alter:true})
//     .then(() => {
//         console.log('doctors table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating doctors table:', error);
//     });

module.exports = meeting;
