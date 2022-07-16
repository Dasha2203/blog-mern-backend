const { PostModel } = require('../models/Post');

module.exports.create = async (req, res) => {
  try {
    const {title, text, tags, imageUrl} = req.body;
    console.log('')
    const doc = new PostModel({
      title,
      text,
      tags: tags.split(','),
      imageUrl,
      user: req.userId
    })

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to create a post'
    })
  }
}

module.exports.getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts)
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to get articles'
    })
  }
}

module.exports.getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId
      },
      {
        $inc: {viewsCount: 1}
      },
      {
        returnDocument: 'after'
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Unable to get article'
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Article not found'
          })
        }

        res.json(doc)
      }
    ).populate('user');
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to get article'
    })
  }
}

module.exports.remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Failed to delete an article'
          })
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Article not found'
          })
        }

        res.json({
          success: true
        })
      }
    );
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to get article'
    })
  }
}

module.exports.update = async  (req, res) => {
  try {
    const postId = req.params.id;
    const {title, text, tags, imageUrl} = req.body;

    await PostModel.updateOne(
      {
        _id: postId
      },
      {
        title,
        text,
        tags: tags.split(','), imageUrl,
        user: req.userId
      }
    );

    res.json({
      success: true
    })
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to update the article'
    })
  }
}

module.exports.getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(10).exec();
    const tags = posts.map(post => post.tags).flat().slice(0, 5);

    res.json(tags)
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to get articles'
    })
  }
}