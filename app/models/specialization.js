const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");

const specialization = sequelize.define('specialization',{
    id:{
        type:DataTypes.UUID,
        allowNull:false,
        primaryKey:true,
        defaultValue: DataTypes.UUIDV4,
    },
    specialization:{
        type:DataTypes.STRING(255),
        allowNull:false,
    },
})

// specialization.sync({})
//     .then(() => {
//         console.log('specialization table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating specialization table:', error);
//     });
module.exports = specialization