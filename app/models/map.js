const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");



const Map = sequelize.define('map',{

     id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

    name:{
       type:DataTypes.STRING,
       allowNull:false
    },

     latitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
})

// Map.sync({alter:true}).then(()=>{
//     console.log('map table created successfully')
// }).catch((err)=>{
//     console.log(err.message)
// })

module.exports = Map