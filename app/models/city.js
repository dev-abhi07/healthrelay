const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");



const City = sequelize.define('city',{
    id: {
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    stateId:{
        type:DataTypes.UUID,
        allowNull:false,
    }
},{
    timestamps:true
})

// City.sync({ alter: true })
//     .then(() => {
//         console.log('City table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating City table:', error);
//     });

module.exports = City;