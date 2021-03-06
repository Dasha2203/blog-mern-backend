const express = require('express');
const mongoose = require('mongoose');
const multer  = require('multer');
const cors = require('cors');
const fs = require('fs');
const { postController, userController } = require("./controllers/index");
const { checkAuth, handleValidationErrors } = require("./utils/index");
const { registerValidation, loginValidation, postCreateValidation } = require("./validations/index");

mongoose.connect('mongodb+srv://admin:admin@cluster0.osf2l.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => {
    console.log('db ok')
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Routes
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`,
  })
})

app.post('/auth/login', loginValidation, handleValidationErrors, userController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, userController.register);
app.get('/auth/me', checkAuth, userController.me);

app.get('/posts', postController.getAll);
app.get('/posts/tags', postController.getLastTags);
app.get('/posts/:id', postController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.create);
app.delete('/posts/:id', checkAuth, postController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, postController.update);

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.log('error', error)
    return
  }
  console.log('server started')
})