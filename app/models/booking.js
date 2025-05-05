const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");


const booking = sequelize.define('booking',{
     id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue:DataTypes.UUIDV4,
        },
    doctorId:{
        type:DataTypes.UUID,
        allowNull:false

    },
    appointment_num: {
        type: DataTypes.STRING,
        allowNull:true,
      },
    patientName:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    symptoms:{
        type:DataTypes.STRING,
        allowNull:true

    },
    userId:{
        type:DataTypes.UUID,
        allowNull:false
    },
    date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    startTime:{
        type:DataTypes.TIME,
        allowNull:true

    },
    endTime:{
        type:DataTypes.TIME,
        allowNull:true
    },
   status:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
   },
   fee:{
    type:DataTypes.FLOAT,
    allowNull:false

   },
   image:{
    type:DataTypes.STRING,
    allowNull:true
   },
   gender:{
    type:DataTypes.STRING,
    allowNull:true
   },
   email:{
    type:DataTypes.STRING,
     allowNull:true   
   },
   reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

})

// booking.sync({alter:true})
//     .then(() => {
//         console.log('doctors table created successfully');
//     })
//     .catch((error) => {
//         console.error('Error creating doctors table:', error);
//     });


module.exports = booking;