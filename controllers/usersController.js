const User = require('../models/User');
const { isStrongPassword } = require('validator');
const passport = require('passport');
const debug = require('debug')('app:usersController');
const bcrypt = require('bcryptjs');

// POST request for login
exports.loginPost = passport.authenticate('local', { failureMessage: true, successRedirect: '/', 
    failureRedirect: '/', successMessage: 'Authentication successful' });

exports.signupPost = async (req, res, next) => {
    const { 
        signup_password,
        signup_password_confirm,
        signup_email: email,
        signup_first_name: firstName,
        signup_last_name: lastName,
    } = req.body;

    try {
        if (!isStrongPassword(signup_password)) {
            throw new Error('Must be min 8 chars & contain uppercase & lowercase chars, numbers & ' 
                            + 'symbols');
        }
        if (signup_password !== signup_password_confirm) {
            throw new Error('Passwords must match');
        }
        const hashedPassword = await bcrypt.hash(signup_password, 10);
        const user = new User({ email, firstName, lastName, hashedPassword });
        await user.save();
        debug('Mongoose user object: ', user);
        req.session.errorsObj = undefined;  /* there's no ValidationError from the schema validation
        nor password validation so "delete" any previous errors from the req obj */
        res.redirect('/');
    }

    catch(err) {
        if (err.message === 'Passwords must match' || err.message === 'Must be min 8 chars &'
            + ' contain uppercase & lowercase chars, numbers & symbols') {
                /* these errors did not originate from the Mongoose schema validation, so can safely
                execute the schema validation to see if there are any additional invalid fields.
                Plug in a fake password hash so the validation doesn't fail due to a lack of a
                real password hash */
                const hashedPassword = 'fake password hash';
                const user = new User({ email, firstName, lastName, hashedPassword });
                const schemaValidationErrors = user.validateSync();
                if (schemaValidationErrors) {
                    // there were schema validation errors in addition to password validation errors
                    let totalValidationErrors = {...schemaValidationErrors.errors};
                    if (err.message === 'Passwords must match') {
                        totalValidationErrors.passwordConfirmation = err.message;
                    }
                    else {
                        totalValidationErrors.password = err.message;
                    }
                    req.session.errorsObj = totalValidationErrors;  /* passes all validation errors 
                    on the req obj via the session middleware in order to report to the user */
                    res.redirect('/');
                }
                else {
                    /* there were only password validation errors. Build an errorsObj that has the 
                    same signature as the errors object created by Mongoose. pass password errors on
                    the req obj via the session middleware in order to report to the user */
                    if (err.message === 'Passwords must match') {
                        req.session.errorsObj.passwordConfirmation = err.message;
                    }
                    else {
                        req.session.errorsObj.password = err.message;
                    } 
                    res.redirect('/');
                }
        }
        
        else if (err.constructor.name === 'ValidationError') {
            // there were no password validation errors, only Mongoose schema validation errors
            req.session.errorsObj = err.errors;  /* passes any ValidationError (from the schema 
            validation) on the req obj via the session middleware, in order to report to user */
            res.redirect('/');
        }

        else {
            next(err);
        }

    }
};