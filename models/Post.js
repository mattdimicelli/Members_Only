const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true, 
        minLength: [1, 'Must be at least one char'],
        maxLength: 80,
    },
    timestamp: { 
        type: Date, 
        required: true, 
        default: Date.now,
    },
    body: { 
        type: String, 
        required: [true, 'Message is required'], 
        trim: true, 
        minLength: [1, 'Must be at least one char'],
        maxLength: 10000,
    },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = model('Post', postSchema);