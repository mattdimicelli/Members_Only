const mongoose = require('mongoose');
const debug = require('debug')('app:database');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (err) => debug(`Connection error: ${err}`));
db.once('open', () => {
    debug('Connected to MongoDB');
});

module.exports = db;