const { DataTypes } = require('sequelize');
const sequelize = require('./database'); // พาธไปยังไฟล์ตั้งค่า Sequelize

const Userlogin = sequelize.define('user_login', {
  // กำหนดฟิลด์และประเภทข้อมูล
  ul_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // หรือ false, ขึ้นอยู่กับความต้องการของคุณ
  },
  ul_username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ul_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
    freezeTableName: true, // ใช้ชื่อตารางตามที่กำหนด ('user') ไม่เพิ่ม 's' ท้าย
    timestamps: false,

});

module.exports = Userlogin;