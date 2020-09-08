const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const AccessError = require('../errors/access-error');

module.exports.getAllCards = async (req, res, next) => {
  try {
    const card = await Card.find({});
    return res.send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);
    if (card === null) {
      throw new NotFoundError('Объект не найден');
    } else if (!(card.owner.toString() === userId)) {
      throw new AccessError('Вы не можете удалить чужую карточку');
    } else {
      await card.remove();
      return res.send(card);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const cardToLike = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (cardToLike === null) {
      throw new NotFoundError('Объект не найден');
    } else {
      return res.send(cardToLike);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const cardToDislike = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (cardToDislike === null) {
      throw new NotFoundError('Объект не найден');
    } else {
      return res.send(cardToDislike);
    }
  } catch (err) {
    next(err);
  }
};
