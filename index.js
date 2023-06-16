const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000; // Choose a port number
const db = require('./config/mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo');
const customMware = require('./config/flashMiddleware');
const flash = require('connect-flash');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// no static file
// app.use(express.static('./assets'));

// Define your routes here
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'Employee',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongoUrl: 'mongodb://localhost/student_info', // MongoDB connection URL
            autoReconnect: true,
            collection: 'sessions',
            ttl: 60 * 60 
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

//auth intalization
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedEmployee);

app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
