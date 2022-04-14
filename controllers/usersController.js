const User = require('../models/User');
const mongoose = require('mongoose');
const { generatePasswordHash } = require('../lib/passwordUtils');
const debug = require('debug')('app:usersController');

// POST request for login
exports.loginPost = async (req, res, next) => {
    try {
        const posts = await Post.find({}).exec();
        res.render('posts', { posts, title: 'Home' });
    }
    catch(err) {
        next(err);
    }
};

exports.signupPost = async (req, res, next) => {
    try {
        const { 
            signup_password_confirm,
            signup_password,
            signup_email: email,
            signup_first_name: firstName,
            signup_last_name: lastName,
        } = req.body;
        const hashedPassword = await generatePasswordHash(signup_password);
        const user = new User({ email, firstName, lastName, hashedPassword });
        await user.save();
        debug(`User: ${user}`);
        res.redirect('/');
    }
    catch(err) {
        if (err.constructor.name === 'ValidationError') {
            console.log(err);
        }
        next(err);
    }
};