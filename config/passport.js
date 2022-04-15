const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const debug = require('debug')('app:passport')

const customFields = {
    usernameField: 'login_email',
    passwordField: 'login_password',
};

const verifyCallback = async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) { 
            return done(null, false, { message: 'User not found' });
        }

        const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
        if (passwordsMatch) { 
            return done(null, user);
        }

        else { 
            return done(null, false, { message: 'Invalid password' });
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


