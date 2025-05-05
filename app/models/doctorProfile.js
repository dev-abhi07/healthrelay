

const { DataTypes } = require("sequelize");
const sequelize = require("../connection/sequelize");

    const DoctorProfile = sequelize.define('DoctorProfile', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
      PK_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      DoctorId:{
        type:DataTypes.STRING,
        unique:true
      },
      name: DataTypes.STRING,
      degree: DataTypes.STRING,
      designation: DataTypes.STRING,
      dept_name: DataTypes.STRING,
      ImageUrl: DataTypes.STRING,
      ProfilePageUrl: DataTypes.STRING,
      DeptId: DataTypes.STRING,
      Profile: DataTypes.STRING,
      Education: DataTypes.STRING,
      ExperienceDetails: DataTypes.TEXT,
      Journey: DataTypes.TEXT,
      Membership: DataTypes.STRING,
      Specialization: DataTypes.TEXT,
      AppointmentFee: DataTypes.FLOAT,
      ConsultancyFee: DataTypes.FLOAT,
      Experience: DataTypes.FLOAT,
      About: DataTypes.TEXT
    }, {
      tableName: 'DoctorProfiles',
      timestamps: false
    });


    // DoctorProfile.sync({alter:true}).then(()=>{
    //     console.log('doctor profile table created successfully')
    // }).catch((err)=>{
    //     console.log(err)
    // })

    module.exports = DoctorProfile
  
 
  