const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../connection/sequelize");

const doctors = sequelize.define('doctor', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    doctors_id:{
        type:DataTypes.STRING(20),
        allowNull:true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    degree:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    designation:{
        type:DataTypes.STRING,
        allowNull:true
    },
    dept_name:{
        type:DataTypes.STRING,
        allowNull:true
    },
    doctor_img:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    specialization: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true
    },
    fees:{
        type:DataTypes.FLOAT,
        allowNull:true,
    },
    departmentId:{
        type:DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true
    },
    diseaseId:{
        type:DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true
    }
})


// doctors.sync({})
//     .then(() => {
//         console.log('doctors table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating doctors table:', error);
//     });

module.exports = doctors