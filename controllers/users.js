const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    if (!(password === undefined) && !(password.length < 8)) {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name, about, avatar, email, password: hash,
      });
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    } else {
      res.status(400).send({ message: 'Пароль должен состоять не менее чем из 8 символов' });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации' });
    } else if (err.code === 11000 && err.name === 'MongoError') {
      res.status(409).send({ message: 'Такой пользователь уже существует' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
      });
    return res.send({ token });
  } catch (err) {
    res.status(401).send({ message: 'Неверный логин или пароль' });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    return res.send(allUsers);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      res.status(404).send({ message: 'Нет такого пользователя' });
    } else {
      return res.send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Ошибка валидации ID' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.updateProfile = async (req, res) => {
  const { name, about } = req.body;

  try {
    const userToUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    );
    if (userToUpdate === null) {
      res.status(404).send({ message: 'Нет такого пользователя' });
    } else {
      return res.send(userToUpdate);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;

  try {
    const userToUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    );
    if (userToUpdate === null) {
      res.status(404).send({ message: 'Нет такого пользователя' });
    } else {
      return res.send(userToUpdate);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};
