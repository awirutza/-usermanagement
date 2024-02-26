const { DataTypes } = require('sequelize');
const sequelize = require('./database'); // พาธไปยังไฟล์ตั้งค่า Sequelize

const User = sequelize.define('User', {
  // กำหนดฟิลด์และประเภทข้อมูล
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // หรือ false, ขึ้นอยู่กับความต้องการของคุณ
  },
  user_fname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_lname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_sex: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_mail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_enducation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
    freezeTableName: true, // ใช้ชื่อตารางตามที่กำหนด ('user') ไม่เพิ่ม 's' ท้าย
    timestamps: false,

});

module.exports = User;