const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");


const cart = sequelize.define("cart", {
     id: {
               type: DataTypes.UUID,
               allowNull: false,
               primaryKey: true,
               defaultValue:DataTypes.UUIDV4,
           },
    medicineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type:DataTypes.UUID,
        allowNull: false,
    },
   
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    price:{
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      discountAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      finalPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      promotionId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      
    }, {
    timestamps: true, 

})

// cart.sync({alter:true})
//     .then(() => {
//         console.log('cart table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating cart table:', error);
//     });

module.exports = cart;