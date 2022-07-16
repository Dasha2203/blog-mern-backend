const { body } = require('express-validator');


const postCreateValidation = [
  body('title', 'Enter the title of the article').isLength({min: 3}).isString(),
  body('text', 'Enter the text of the article').isLength({min: 10}).isString(),
  body('tags', 'Wrong tag format, specify the array').optional().isString(),
  body('imageUrl', 'Incorrect image link').optional().isString(),
]

module.exports.postCreateValidation = postCreateValidation;