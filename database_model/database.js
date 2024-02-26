const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('usermanagement', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql', 
  });

// ตรวจสอบการเชื่อมต่อ
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;