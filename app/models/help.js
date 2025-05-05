const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");



const HelpCenter = sequelize.define('help',{
      id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue:DataTypes.UUIDV4,
            },

        mobile:{
            type:DataTypes.STRING(10),
            allowNull:false
        },

        message:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull:true
        },
        userId:{
            type:DataTypes.UUID,
            allowNull:true
        }
})

// HelpCenter.sync({alter:true}).then(()=>{
//     console.log('help table created successfully')
// }).catch(()=>{
//     console.log('help table not created successfully')
// })



module.exports = HelpCenter