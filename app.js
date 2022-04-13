const createError = require('http-errors');
const logger = require('morgan');
const debug = require('debug')('app');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { Strategy: LocalStrategy } = require('passport-local');
const MongoStore = require('connect-mongo');
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const { loginPost, signupPost } = require('./controllers/usersController');
const compression = require('compression');
const helmet = require('helmet');

require('dotenv').config();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet()); /* a wrapper around 15 smaller middlewares which secure the app by setting 
various http headers */
app.use(compression()); // attempts to request response bodies
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.post('/login', loginPost);
app.post('/signup', signupPost);





app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err: {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (err) => debug(`Connection error: ${err}`));
db.once('open', () => {
    debug('Connected to MongoDB');
});


const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);





function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);  // tells the OS to terminate this module immediately.  1 means "uncaught
        // fatal exception"
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }


function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }