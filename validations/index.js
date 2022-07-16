const { registerValidation, loginValidation } = require('../validations/auth');
const { postCreateValidation } = require("../validations/post");

module.exports = {
  registerValidation,
  loginValidation,
  postCreateValidation
}