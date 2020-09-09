const validator = require('validator');
const ValidationError = require('../errors/validation-error');

const validationUrl = (link) => {
  if (!validator.isURL(link)) {
    throw new ValidationError('Ссылка не валидна');
  }
  return link;
};
module.exports = validationUrl;
