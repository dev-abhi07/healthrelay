const sequelize = require("../connection/sequelize");

const { DataTypes } = require("sequelize");

const otp = sequelize.define('otp', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    otp: {
        type: DataTypes.STRING(6),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "OTP cannot be empty"
            },
            isNumeric: {
                msg: "OTP must be numeric"
            },
            len: {
                args: [6, 6],
                msg: 'OTP must be 6 digits',
            }
        }
    },
    expireAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Mobile number cannot be empty"
            },
            isNumeric: {
                msg: "Mobile number must be numeric"
            },
            len: {
                args: [10, 10],
                msg: 'Mobile number must 10 digits',
            },
            isValidIndianMobile(value) {               
                if (!/^[6-9]\d{9}$/.test(value)) {
                    throw new Error('Mobile number is invalid');
                }
            }
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'verified'),
        defaultValue: 'pending'
    }

})
// otp.sync()
//     .then(() => {
//         console.log('OTP table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating OTP table:', error);
//     });

module.exports = otp;