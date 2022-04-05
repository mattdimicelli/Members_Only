const { Schema, model } = require('mongoose');
const { isAlpha, isEmail } = require('validator');

const alphaValidator = [input => isAlpha(input, {ignore: ' '}),
                         '{PATH} must be letters and space only' ];

const emailValidator = [input => isEmail(input), '{PATH} must be an email address'];


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
    member: { type: Boolean, required: true },
});

userSchema.virtual('fullName').get(function() {
        return `${this.firstName} ${this.lastName}`;
    });

module.exports = model('User', userSchema);