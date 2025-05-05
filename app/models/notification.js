

const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");

const Notification = sequelize.define("notification", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    deviceToken: {
        type: DataTypes.STRING,
        allowNull:true,
    },
    platform: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    // isRead: {
    //     type: DataTypes.BOOLEAN,
    //     defaultValue: false,
    // },
});

// Notification.sync({ alter: true })
//     .then(() => console.log("Notification table created successfully"))
//     .catch((error) => console.error("Error creating notification table:", error));

module.exports = Notification;

