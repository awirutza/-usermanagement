const express = require('express')
const app = express()
const port = 3000
const { Sequelize } = require('sequelize');
const User = require('./database_model/user'); 
const bodyParser = require('body-parser');
const Userlogin = require('./database_model/user_login')

app.use(bodyParser.json());

app.post('/userslogin', async (req, res) => {
  const username =  req.body.username;
  const password =  req.body.password;
  
});

app.post('/register',async (req,res) =>{
  try {
    // สร้าง (insert) ข้อมูลผู้ใช้ใหม่ในฐานข้อมูล
    const newUser = await User.create({
      user_fname: req.body.fname,
      user_lname: req.body.lname,
      user_sex: req.body.sex,
      user_mail: req.body.mail,
      user_address: req.body.address,
      user_enducation: req.body.education
    });
    // ส่ง response กลับไปพร้อมข้อมูลผู้ใช้ที่ถูกสร้าง
    res.status(201).json(newUser);
  } catch (error) {
    // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบ, ฯลฯ)
    res.status(400).json({ error: error.message });
  }
})

app.get('/info',async (req,res)=>{
  //ดึงข้อมูลผู้ใช้มาแสดงผล
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
