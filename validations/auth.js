const { body } = require('express-validator');


const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должено состоять минимум из 5 символов').isLength({min: 5}),
  body('fullName', 'Укажите имя').isLength({min: 3}),
  body('avatarUrl', 'Неверная ссылка на ававтарку').optional().isURL(),
]

const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должено состоять минимум из 5 символов').isLength({min: 5})
]

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;