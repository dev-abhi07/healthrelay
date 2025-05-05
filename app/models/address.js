const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");


const Address = sequelize.define("address", {
    id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue:DataTypes.UUIDV4,
        },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    addressLine1: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    mobile: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true
})

// Address.sync({ alter: true })
//     .then(() => {
//         console.log('address table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating address table:', error);
//     });

module.exports = Address;