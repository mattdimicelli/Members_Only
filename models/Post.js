const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true, 
        minLength: 1,
    },
    timestamp: { 
        type: Date, 
        required: true, 
        default: Date.now,
    },
    body: { type: String, required: true, trim: true, minLength: 1},
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = model('Post', postSchema);