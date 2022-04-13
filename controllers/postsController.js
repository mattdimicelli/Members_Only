const Post = require('../models/Post');
const mongoose = require('mongoose');

// Display home page (posts)
exports.homeGet = async (req, res, next) => {
    try {
        const posts = await Post.find({}).exec();
        res.render('posts', { posts, title: 'Home' });
    }
    catch(err) {
        next(err);
    }
}