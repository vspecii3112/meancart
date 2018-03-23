var mongoose = require('mongoose');
    express = require('express');
    cors = require('cors');
    morgan = require('morgan');
    config = require('./config/database');
    passport = require('passport');
    cookieParser = require('cookie-parser');
    //csrf = require('csurf');
    bodyParser = require('body-parser');
    session = require('express-session');
    MongoStore = require('connect-mongo')(session); //passes the session to connect-mongo
    routes = require('./routes/routes');
    userRoutes = require('./routes/user');
    port = process.env.PORT || 3333,

mongoose.connect(config.database);
require('./config/passport')(passport);

mongoose.connection.on('open', function(){
    console.log('Mongo is connected');
    var app = express();
    app.use(morgan('dev'));
    
    //app.use(cors());
    /*app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Headers", "Authorization");
        res.header("Access-Control-Allow-Headers", "Origin");
        res.header("Access-Control-Allow-Methods", "OPTIONS");
        res.header("Access-Control-Allow-Methods", "PUT");
        res.header("Access-Control-Allow-Methods", "GET");
        res.header("Access-Control-Allow-Methods", "POST");
        res.header("Access-Control-Allow-Methods", "DELETE");

        next();
    });*/

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(session({
        secret: 'supersecret',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection}),   //uses the existing mongoose connection
        cookie: {
            maxAge: 60*60*1000
        }
    }));

    /*
    app.use(csrf());
    app.use(function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return next();
    });
    */

    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use('/user', userRoutes);
    app.use('/', routes);
    
    app.listen(port, function(){
        console.log('Express server listening on port ' + port + '.');
    })
})


