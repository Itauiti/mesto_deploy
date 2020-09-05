const Card = require('../models/card');

module.exports.getAllCards = async (req, res) => {
  try {
    const card = await Card.find({});
    return res.send(card);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);
    if (card === null) {
      res.status(404).send({ message: 'Объект не найден' });
    } else if (!(card.owner.toString() === userId)) {
      res.status(403).send({ message: 'Вы не можете удалить чужую карточку' });
    } else {
      await card.remove();
      return res.send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Ошибка валидации ID' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.likeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const cardToLike = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (cardToLike === null) {
      res.status(404).send({ message: 'Объект не найден' });
    } else {
      return res.send(cardToLike);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Ошибка валидации ID' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

module.exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const cardToDislike = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (cardToDislike === null) {
      res.status(404).send({ message: 'Объект не найден' });
    } else {
      return res.send(cardToDislike);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Ошибка валидации ID' });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};
