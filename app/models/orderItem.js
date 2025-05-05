const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");



const OrderItem = sequelize.define("orderItem", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type:DataTypes.UUID,
      allowNull: false,
    },
    medicineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    timestamps: true
  });


    // OrderItem.sync({alter:true})
    // .then(() => {
    //     console.log('order item table created successfully');
    // })
    // .catch((error) => {
    //     console.error('Error creating order item table:', error);
    // });

module.exports = OrderItem;
  