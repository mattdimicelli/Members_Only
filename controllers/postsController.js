const Post = require('../models/Post');

exports.createPostGet = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('create_post', {title: 'Post a Message'});
    }
    else {
        req.flash('login_status', 'Not logged in');
        res.redirect('/');
    }
}

exports.createPostPost = async (req, res, next) => {
    try {
        const { message: body, title } = req.body;
        const author = req.user;
        const post = new Post({title, body, author});
        await post.save();
        res.redirect('/');
    }
    catch(err) {
        next(err);
    }
    
}

// Display home page (posts)
exports.homeGet = async (req, res, next) => {
    const errorsObj = req.session.errorsObj;
    // if errorsObj, there were errors from signup/login form validation

    try {
        const posts = await Post.find({}).exec();
        res.render('posts', { posts, title: 'Home', errors: errorsObj, 
            message: req.flash('login_status') });
    }
    catch(err) {
        next(err);
    }
}