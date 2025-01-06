const express = require('express');
const cookieParser = require('cookie-parser');
const User = require('./models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

// Register
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      const user = await User.create({ name, email, password: hash });
      const token = jwt.sign({ email }, 'shhhhh');
      res.cookie('token', token);
      res.send(user);
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send('Something went wrong');
  }
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      const token = jwt.sign({ email }, 'shhhhh');
      res.cookie('token', token);
      res.send('Login Successful');
    } else {
      res.status(400).send('Something went wrong');
    }
  });
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
