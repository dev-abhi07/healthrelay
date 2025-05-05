

const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");

const Department = sequelize.define('department',{
    id:{
        type:DataTypes.UUID,
        allowNull:false,
        primaryKey:true,
        defaultValue: DataTypes.UUIDV4,
    },
    name:{
        type:DataTypes.STRING(255),
        allowNull:false,
    },
})

// Department.sync({})
//     .then(() => {
//         console.log('department table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating department table:', error);
//     });
module.exports = Department