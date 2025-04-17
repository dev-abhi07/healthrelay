const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");

const users = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Name cannot be empty"
            },           
            len: {
                args: [2, 50],
                msg: 'Name must be between 2 and 50 characters',
            },
            isProperName(value) {
                if (!/^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/.test(value)) {
                    throw new Error('Name must start with capital letters (e.g., John Doe)');
                }
            }
        }
    },
    mobile: {
        type: DataTypes.STRING(15),
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
        },
        unique: {
            msg: "Mobile number already exists",
            args:true
        }
    },
    email:{
        type:DataTypes.STRING(50),
        allowNull:true,
        unique:true
    },
    password:{
        type:DataTypes.STRING(100),
        allowNull:true
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Date of birth cannot be empty"
            },
            isDate: {
                msg: "Date of birth must be a valid date"
            },
            isBefore: {
                args: new Date().toISOString(),
                msg: "Date of birth must be in the past"
            }
        }
    },
    gender: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    pin_code: {
        type: DataTypes.STRING(6),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Pincode cannot be empty"
            },
            isNumeric: {
                msg: "Pin Code must be numeric"
            },
            len: {
                args: [6, 6],
                msg: 'Pin Code must be 6 digits',
            }
        }
    },
    token:{
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    ip:{
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    role:{
        type: DataTypes.ENUM('admin', 'user','doctor'),
        defaultValue: 'user'
    }
})

// users.sync({alter:true})
//     .then(() => {
//         console.log('Users table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating Users table:', error);
//     });
module.exports = users;