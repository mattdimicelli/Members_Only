const { Schema, model } = require('mongoose');
const { isAlpha, isEmail, isStrongPassword } = require('validator');

const alphaValidator = [input => isAlpha(input, 'en-US',{ignore: ' '}),
                         '{PATH} must be letters and space only' ];

const emailValidator = [input => isEmail(input), '{PATH} must be an email address'];

// const passwordValidator = [input => isStrongPassword(input), '{PATH} must be minimum of 8 characters' 
// + ' long and have at least 1 uppercase character, 1 lowercase character, 1 number, and 1 symbol'];


const userSchema = new Schema({
    firstName: { 
        type: String, 
        required: true, 
        trim: true, 
        validate: alphaValidator,
        minLength: 1,
    },
    lastName: { 
        type: String, 
        required: true, 
        trim: true, 
        validate: alphaValidator,
        minLength: 1
    },
    email: { type: String, required: true, trim: true, validate: emailValidator },
    member: { type: Boolean, required: true, default: false },
    // password: { type: String, required: true, validate: passwordValidator, trim: true }
    hashedPassword: { type: String },
});

userSchema.virtual('fullName').get(function() {
        return `${this.firstName} ${this.lastName}`;
    });

module.exports = model('User', userSchema);