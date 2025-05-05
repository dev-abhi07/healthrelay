const { DataTypes, UUIDV4 } = require("sequelize");
const sequelize = require("../connection/sequelize");

const doctorsAvailability = sequelize.define('doctorsAvailability', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    dayOfWeek: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    fee: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    slotDuration: {
        type: DataTypes.INTEGER,
        allowNull:true,
      
      }
      
})

// doctorsAvailability.sync({alter:true})
//     .then(() => {
//         console.log('doctorsAvailability table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating doctorsAvailability table:', error);
//     });

module.exports = doctorsAvailability