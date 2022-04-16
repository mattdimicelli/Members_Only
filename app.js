const createError = require('http-errors');
const logger = require('morgan');
const debug = require('debug')('app');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const http = require('http');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const compression = require('compression');
const helmet = require('helmet');
const flash = require('connect-flash');
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const { loginPost, signupPost, clearMessagesPost, clearErrorsPost } 
  = require('./controllers/usersController');
const db = require('./config/database');
const { onError, onListening, normalizePort } = require('./lib/serverUtils');

require('dotenv').config();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: 'sessions' }),
  resave: false,  /* usually set to false.  can set to false if the store implments the touch
  method*/ 
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30,  // 30 minutes
  },
}));
app.use(flash());

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  debug('Session obj: ', req.session);
  debug('User obj: ', req.user);
  next();
});

app.use((req, res, next) => {
  res.locals.sessionMessages = req.session.messages;
  next();
});

app.use(helmet()); /* a wrapper around 15 smaller middlewares which secure the app by setting 
various http headers */
app.use(compression()); // attempts to request response bodies
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.post('/login', loginPost);
app.post('/signup', signupPost);
app.post('/clear-errors', clearErrorsPost);
app.post('/clear-messages', clearMessagesPost);


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




const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', () => onListening(server));


