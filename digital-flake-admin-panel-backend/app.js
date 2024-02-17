require('dotenv').config();
const config = require('./config');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.static(__dirname+'/uploads'));
const multer = require('multer');
const form = multer();
const jwt = require('./middleware/jwt');
const login = require('./routes/login');
const user = require('./routes/user');
const category = require('./routes/category');
const product = require('./routes/product');
const forget_passoword = require('./routes/forget_password')

app.use('/login', form.any(), login);
app.use('/user', form.any(), user);
app.use('/category', form.any(),jwt.authenticateToken, category);
app.use('/product',jwt.authenticateToken, product);
app.use('/forget_passoword',form.any(), forget_passoword);

app.listen(3000);

