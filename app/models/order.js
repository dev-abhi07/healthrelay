const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");


const Order = sequelize.define("order", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "completed", "cancelled"),
        defaultValue: "pending",
    },
    promotionId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    discountAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    addressId:{
      type: DataTypes.UUID,
      allowNull:true,
    },
    orderNum:{
      type:DataTypes.STRING,
      allowNull:true
    },
    remark:{
      type:DataTypes.TEXT,
      allowNull:true
    }
    
  }, {
    timestamps: true
  });

  // Order.sync({alter:true})
  //   .then(() => {
  //       console.log('order table created successfully');
  //   })
  //   .catch((error) => {
  //       console.error('Error creating order table:', error);
  //   });

module.exports = Order;


  