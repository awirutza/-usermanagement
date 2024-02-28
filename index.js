const express = require('express')
const app = express()
const port = 3000
const { Sequelize } = require('sequelize');
const User = require('./database_model/user'); 
const bodyParser = require('body-parser');
const Userlogin = require('./database_model/user_login')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const {google} = require('googleapis');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'template'));


app.use(bodyParser.json());
// เสิร์ฟไฟล์ static จากโฟลเดอร์ public
app.use(express.static('public'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

passport.use(new GoogleStrategy({
  clientID: '40728501087-emgstpsl1a5pc0rsqtrl8f7k08jhjsef.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  // ในส่วนนี้, ใช้ profile ที่ได้จาก Google ในการค้นหาหรือสร้าง user ในฐานข้อมูลของคุณ
  return cb(null, profile);
}
));


app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// ใช้ session กับ Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Authentication สำเร็จ, redirect ไปยังหน้าแรก
    console.log('User profile:', req.user.profile[0].value);
    console.log('User email:', req.user.emails[0].value); // ตัวอย่างการเข้าถึงอีเมล์
    res.redirect('/');
});


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

//Set cookie username
function setLoginCookie(res, username) {
  const d = new Date();
  d.setTime(d.getTime() + (24*60*60*1000)); // ตั้งค่าให้คุกกี้หมดอายุใน 1 วัน
  const expires = "expires=" + d.toUTCString();
  
  res.setHeader('Set-Cookie', `username=${username}; ${expires}; path=/`);
}

//ตรวจสอบว่ามี cookie หรือไม่
function getCookie(name) {
  let cookieArray = document.cookie.split(';');
  for(let i = 0; i < cookieArray.length; i++) {
      let cookiePair = cookieArray[i].split('=');
      if(name == cookiePair[0].trim()) {
          return decodeURIComponent(cookiePair[1]);
      }
  }
  return "";
}

app.get('/login',(req,res) =>{
  res.sendFile(path.join(__dirname, 'public', 'template', 'login.html'));
})

app.get('/',(req,res) =>{
  res.sendFile(path.join(__dirname, 'public', 'template', 'main.html'));
})

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
    }else{
      setLoginCookie(res, user.ul_username);
      const token = jwt.sign({ id: user.ul_id }, 'yourSecretKey', { expiresIn: '1h' });
      res.redirect(`/info?id=${token}`);

    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/register-user',(req,res) =>{
  res.sendFile(path.join(__dirname, 'public', 'template', 'register.html'));

})

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
    res.redirect('/login');
    
  } catch (error) {
    // จัดการกับข้อผิดพลาด (เช่น, ข้อมูลไม่ครบ, ฯลฯ)
    res.status(400).json({ error: error.message });
    
  }
  
})

app.get('/info',async (req,res)=>{

  const token = req.query.id;
  const decoded = jwt.verify(token, 'yourSecretKey');

  const information = await User.findOne({ where: { user_id: decoded.id } });

  if (!information) {
    return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
  }
  const user = {
    fname: information.user_fname,
    lname: information.user_lname,
    sex: information.user_sex,
    mail: information.user_mail,
    address: information.user_address,
    education:information.user_enducation
  };
  res.render('info', { user });
  

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
