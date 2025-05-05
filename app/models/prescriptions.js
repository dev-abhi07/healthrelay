

const { DataTypes } = require('sequelize');
const sequelize = require('../connection/sequelize');
const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  medicineName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dosage: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  frequency: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  document:{
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  diagnosis:{
    type:DataTypes.STRING,
    allowNull:true,

  }
  
}, {
  tableName: 'prescriptions',
  timestamps: true,
});

// Prescription.sync({ alter: true })
//     .then(() => {
//         console.log('Prescriptions table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating OTP table:', error);
//     });



module.exports = Prescription;
