const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const {UserModel} = require("../models/User");
const jwt = require("jsonwebtoken");


module.exports.register = async (req, res) => {

  try {
    const {email, fullName, avatarUrl, password} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email,
      fullName,
      avatarUrl,
      passwordHash: hash
    })

    // save new user in DB
    const user = await doc.save();

    // generate token for user (1 - data, 2 - secret key, 3 - Token lifetime)
    const token = jwt.sign(
      {
        id: user._id
      },
      'secret123',
      {
        expiresIn: '30d'
      }
    );

    const { passwordHash, ...userData} = user._doc;

    res.json({
      ...userData,
      token
    })

  } catch(err) {
    console.log('Failed to register', err);
    res.status(500).json({
      message: 'Failed to register'
    })
  }
}

module.exports.login = async (req, res) => {
  console.log('fkkfkf');
  try {
    const user = await UserModel.findOne({email: req.body.email});

    if (!user) {
      return res.status(400).json({
        message: 'Invalid login or password'
      })
    }

    const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Invalid login or password'
      })
    }

    // generate token for user (1 - data, 2 - secret key, 3 - Token lifetime)
    const token = jwt.sign(
      {
        id: user._id
      },
      'secret123',
      {
        expiresIn: '30d'
      }
    );

    const { passwordHash, ...userData} = user._doc;

    res.json({
      ...userData,
      token
    })

  } catch(err) {
    console.log('Failed to login: ', err);
    res.status(500).json({
      message: 'Failed to login'
    })
  }
}

module.exports.me = async (req, res) => {
  try {
    console.log('hey id = ', req.userId);
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({
        message: 'User is not found'
      });
    }

    const { passwordHash, ...userData} = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      message: 'No access'
    });
  }
}