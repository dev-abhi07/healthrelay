const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");

const Promotions = sequelize.define("promotions", {
    id: {
           type: DataTypes.UUID,
           defaultValue: DataTypes.UUIDV4,
           primaryKey: true
       },
   code:{
       type: DataTypes.STRING,
       allowNull: false
   },
   description:{
       type: DataTypes.STRING,
       allowNull: true
   },
   discountType:{
       type: DataTypes.ENUM('percentage', 'fixed'),
       allowNull: false
   },
   discountValue:{
       type: DataTypes.FLOAT,
       allowNull: false
   },
   startDate:{
       type: DataTypes.DATE,
       allowNull: false
   },
   endDate:{
       type: DataTypes.DATE,
       allowNull: false
   },
   is_active:{
       type: DataTypes.BOOLEAN,
       defaultValue: false
   },
  
})

// Promotions.sync({ alter: true })
//     .then(() => {
//         console.log("Promotions table created successfully!");
//     })
//     .catch((error) => {
//         console.error("Error creating Promotions table:", error);
//     });

module.exports = Promotions;