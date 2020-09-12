const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const validationUrl = require('../validation/validationUrl');

const {
  getAllUsers, getUser, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.objectId(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validationUrl),
  }),
}), updateAvatar);

module.exports = router;
