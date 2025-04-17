const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");

const healthCentre = sequelize.define('healthCentre', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    hospital_id:{
        type:DataTypes.STRING(10),
        allowNull:true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    landline: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    pin_code: {
        type: DataTypes.STRING(6),
        allowNull: true,
        validate: {
            notEmpty: {
                msg: "Pin Code cannot be empty"
            },
            isNumeric: {
                msg: "Pin Code must be numeric"
            },
            len: {
                args: [6, 6],
                msg: 'Pin Code must be 6 digits',
            }
        }
    },
    state:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    city:{
        type:DataTypes.STRING,
        allowNull:true
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    labTest: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    orderMedicine: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    healthCheckup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    onlineConsult: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

// healthCentre.sync({alter:true})
//     .then(() => {
//         console.log('healthCentre table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating healthCentre table:', error);
//     });

module.exports = healthCentre