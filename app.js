let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let bodyParser = require('body-parser');

let mongoUrl = require('./model/mongoInfo').url;

let autoLogin = require('./routes/autoLogin');
let index = require('./routes/index');
let regist = require('./routes/regist');
let inputCheck = require('./routes/check');
let login = require('./routes/login');
let logout = require('./routes/logout');

let app = express();

// view engine & template path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.jpg')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'WebCoure SignIn',
    cookie: {maxAge: 86400000},
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({url: mongoUrl})
}));
app.use(autoLogin);

app.use('/', index);
app.use('/regist', regist);
app.use('/api/check', inputCheck);
app.use('/api/login', login);
app.use('/api/logout', logout);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    console.log(err);
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
