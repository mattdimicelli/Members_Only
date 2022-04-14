const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const db = require('./database');
const User = require('../models/User');
const { validatePassword } = require('../lib/passwordUtils');

const customFields = {
    usernameField: 'login_email',
    passwordField: 'login_password',
};

const verifyCallback = async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) { 
            return done(null, false)
        };
    
        const isValid = validatePassword(password, user.passwordHash);
        if (isValid) { 
            return done(null, user);
        }
        else { 
            return done(null, false);
        }
    }
    catch (err) {
        done(err);
    }
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);  // in Mongoose .id is a getter which returns a string
    // representation of the document's _id
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findById(userId);
        done(null, user);
    }
    catch(err) {
        done(err);
    }
});


