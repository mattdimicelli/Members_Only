const { Schema, model } = require('mongoose');
const { isAlpha, isEmail } = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const alphaValidator = [input => isAlpha(input, 'en-US',{ignore: ' '}),
                         'Names must be letters and spaces only' ];

const emailValidator = [input => isEmail(input), 'Must be a valid email address'];


const userSchema = new Schema({
    firstName: { 
        type: String, 
        required: [true, 'First name is required'], 
        trim: true, 
        validate: alphaValidator,
        minLength: [1, 'Must be at least one char'],
    },
    lastName: { 
        type: String, 
        required: [true, 'Last name is required'], 
        trim: true, 
        validate: alphaValidator,
        minLength: [1, 'Must be at least one char'],
    },
    email: { 
        type: String,
        required: [true, 'Email address is required'],
        trim: true,
        validate: emailValidator,
        unique: true, 
    },
    member: { type: Boolean, required: true, default: false },
    hashedPassword: { type: String, required: true },
    avatar: { 
        type: String,
        required: [true, 'An avatar is required'],
        enum: {
            values: ['mario', 'luigi', 'peach', 'donkey kong', 'yoshi', 'kirby', 'bowser', 
                    'fox', 'link', 'samus'],
            message: '{VALUE} is not a valid avatar',
        } 
    },
    admin: { type: Boolean, default: false },
});

userSchema.virtual('fullName').get(function() {
        return `${this.firstName} ${this.lastName}`;
    });

userSchema.plugin(uniqueValidator, { message: 'Error: user with email {VALUE} already exists' });

module.exports = model('User', userSchema);