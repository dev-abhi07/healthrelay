const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");


const State = sequelize.define('state',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
},{
    timestamps:true
})

// State.sync({ alter: true })
//     .then(() => {
//         console.log('State table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating State table:', error);
//     });

    module.exports = State;