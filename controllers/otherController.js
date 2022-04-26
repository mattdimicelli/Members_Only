const User = require('../models/User');
const { isStrongPassword } = require('validator');
const passport = require('passport');
const debug = require('debug')('app:otherController');
const bcrypt = require('bcryptjs');

exports.clearErrorsPost = (req, res, next) => {
    req.session.errorsObj = undefined;
    res.redirect('/');
}

exports.clearMessagesPost = (req, res, next) => {
    req.session.messages = undefined;
    res.redirect('/');
}

exports.joinSuperPowerClubGet = async (req, res, next) => {
    if (req.isAuthenticated()) {
            res.render('join_super_power_club', { title: 'Join the Super Power Club!'});
        }
    else {
        res.redirect('/');
    }
}

exports.joinSuperPowerClubPost = async (req, res, next) => {
    const {year} = req.body;
    if (year === '2012') {
        try {
            await User.findByIdAndUpdate(req.user.id, {member: true});
            res.redirect('/');
        }
        catch(err) {
            next(err);
        }
    }
    else {
        res.redirect('/join-super-power-club');
    }
}

// POST request for login
exports.loginPost = passport.authenticate('local', { failureMessage: true, successRedirect: '/', 
    failureRedirect: '/', successMessage: 'Authentication successful' });

exports.logoutGet = (req, res, next) => {
    req.logout();
    res.redirect('/');
}

exports.signupPost = async (req, res, next) => {
    const { 
        signup_password,
        signup_password_confirm,
        signup_email: email,
        signup_first_name: firstName,
        signup_last_name: lastName,
        avatar,
        admin,
        code,
    } = req.body;

    let isStrongPasswordError;
    let pwConfirmErr;
    let adminCodeError;

    const mustMatch = 'Passwords must match';
    const mustBeStrong = 'Must be min 8 chars & contain uppercase & lowercase chars, numbers '
                        + '& symbols';
    const wrongCode = 'Incorrect admin privilege code';

    try {
        if (!isStrongPassword(signup_password)) {
            isStrongPasswordError = new Error(mustBeStrong);
        }
        if (signup_password !== signup_password_confirm) {
            pwConfirmErr = new Error(mustMatch);
        }
        if (code && code !== 'NTDOY') {
            // this validation only executed if the user attempted to gain admin privileges
            adminCodeError = new Error(wrongCode);
        }
        if (isStrongPasswordError) throw isStrongPasswordError;
        if (pwConfirmErr) throw pwConfirmErr;
        if (adminCodeError) throw adminCodeError;

        const hashedPassword = await bcrypt.hash(signup_password, 10);
        const user = new User({ email, firstName, lastName, hashedPassword, avatar, admin });
        await user.save();
        debug('Mongoose user object: ', user);
        req.session.errorsObj = undefined;  /* there's no ValidationError from the schema validation
        nor password validation nor admin privilege code validation so "delete" any previous errors 
        from the req obj */
        res.redirect('/');
    }

    catch(err) {
        if (err.message === mustMatch || err.message === mustBeStrong || err.message === wrongCode){

            /* these errors did not originate from the Mongoose schema validation, so can safely
            execute the schema validation to see if there are any additional invalid fields.
            Plug in a fake password hash so the validation doesn't fail due to a lack of a
            real password hash */
            const hashedPassword = 'fake password hash';
            const user = new User({ email, firstName, lastName, hashedPassword, avatar });
            const schemaValidationErrors = user.validateSync();

            if (schemaValidationErrors) {
                // there were schema validation errors in addition to password validation
                // or admin privilege code validation errors
                let totalValidationErrors = {...schemaValidationErrors.errors};
                if (err.message === mustBeStrong) {
                    totalValidationErrors.password = err.message;
                    if (pwConfirmErr) {
                        totalValidationErrors.passwordConfirmation = pwConfirmErr.message;
                    }
                    if (adminCodeError) {
                        totalValidationErrors.code = adminCodeError.message;
                    }
                }
                else if (err.message === 'Passwords must match') {
                    totalValidationErrors.passwordConfirmation = err.message;
                    if (adminCodeError) {
                        totalValidationErrors.code = adminCodeError.message;
                    }
                }
                else if (err.message === 'Incorrect admin privilege code') {
                    totalValidationErrors.code = err.message;
                }
            req.session.errorsObj = totalValidationErrors;  /* passes all validation errors 
            on the req obj via the session middleware in order to report to the user */
            res.redirect('/');
            }

            else {
                /* there were only password validation or admin privilege code validation errors
                . Build an errorsObj that has the same signature as the errors object created by
                    Mongoose. pass password errors on the req obj via the session middleware in 
                    order to report to the user */
                let errorsObj = {};
                if (err.message === mustBeStrong) {
                    errorsObj.password = err.message;
                    if (pwConfirmErr) {
                        errorsObj.passwordConfirmation = pwConfirmErr.message;
                    }
                    if (adminCodeError) {
                        errorsObj.code = adminCodeError.message;
                    }
                    req.session.errorsObj = errorsObj;
                } 
                if (err.message === mustMatch) {
                    errorsObj.passwordConfirmation = err.message;
                    if (adminCodeError) {
                        errorsObj.code = adminCodeError.message;
                    }
                    req.session.errorsObj = errorsObj;
                }
                if (err.message === wrongCode) {
                    errorsObj.code = err.message;
                    req.session.errorsObj = errorsObj;
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