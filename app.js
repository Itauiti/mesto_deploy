const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();
//const { celebrate, Joi, errors } = require('celebrate');
//Joi.objectId = require('joi-objectid')(Joi);

const limiter = rateLimit({
  windowMs: 25 * 60 * 1000,
  max: 100,
});

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(limiter);
//!!!!аватар
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Ошибка валидации';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Ошибка валидации ID';
  } else if (err.code === 11000 && err.name === 'MongoError') {
    statusCode = 409;
    message = 'Такой пользователь уже существует';
  } else {
    res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  }
  next();
});

app.listen(PORT, () => {
  console.log('работает');
});
