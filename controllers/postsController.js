const Post = require('../models/Post');
const mongoose = require('mongoose');

// Display home page (posts)
exports.homeGet = async (req, res, next) => {
    const errorsObj = req.session.errorsObj;
    // if errorsObj, there were errors from signup/login form validation

    try {
        const posts = await Post.find({}).exec();
        res.render('posts', { posts, title: 'Home', errors: errorsObj });
    }
    catch(err) {
        next(err);
    }
}