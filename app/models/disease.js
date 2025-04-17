const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");


const disease = sequelize.define('', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,        
    }
})

// disease.sync()
//     .then(() => {
//         console.log('disease table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating disease table:', error);
//     });

module.exports = disease
