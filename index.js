const express = require('express')
const app = express()
const port = 3000
const { Sequelize } = require('sequelize');
const User = require('./database_model/user'); 
const bodyParser = require('body-parser');
const Userlogin = require('./database_model/user_login')
const bcrypt = require('bcryptjs');


app.use(bodyParser.json());

app.post('/userslogin', async (req, res) => {
  const { username, password } = req.body;

  try {
    // ค้นหาผู้ใช้จากฐานข้อมูลด้วย username
    const user = await Userlogin.findOne({ where: { ul_username: username } });

    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.ul_password);

    if (!isMatch) {
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // ผู้ใช้พบและรหัสผ่านถูกต้อง
    res.json({ message: 'ลงชื่อเข้าใช้สำเร็จ'});

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
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
    // สร้าง salt และเข้ารหัสรหัสผ่าน
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // สร้างผู้ใช้ใหม่พร้อมรหัสผ่านที่เข้ารหัส
    const newUsernamePassword = await Userlogin.create({
      ul_username: req.body.username,
      ul_password: hashedPassword, // ใช้รหัสผ่านที่เข้ารหัสแทน
    });
    // ส่ง response กลับไปพร้อมข้อมูลผู้ใช้ที่ถูกสร้าง
    res.status(201).json("สมัครสมาชิกเรียบร้อยแล้ว");
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
