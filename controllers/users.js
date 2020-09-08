const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const AuthError = require('../errors/auth-error');
const PasswordError = require('../errors/password-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = async (req, res, next) => {
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
      next(new PasswordError('Пароль должен состоять не менее чем из 8 символов'));
    }
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
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
    next(new AuthError('Неверный логин или пароль'));
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({});
    return res.send(allUsers);
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) {
      throw new NotFoundError('Нет пользователя с таким id');
    } else {
      return res.send(user);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
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
      throw new NotFoundError('Нет пользователя с таким id');
    } else {
      return res.send(userToUpdate);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
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
      throw new NotFoundError('Нет пользователя с таким id');
    } else {
      return res.send(userToUpdate);
    }
  } catch (err) {
    next(err);
  }
};
