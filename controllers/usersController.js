const User = require('../models/User');
const mongoose = require('mongoose');

// POST request for login
exports.loginPost = async (req, res, next) => {
    try {
        const posts = await Post.find({}).exec();
        res.render('posts', { posts, title: 'Home' });
    }
    catch(err) {
        next(err);
    }
}