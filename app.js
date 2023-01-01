const express = require('express'); // server software
const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session'); // session middleware
const passport = require('passport'); // authentication
require('dotenv').config()



const User = require('./models/user'); // custom dependency

const app = express();
const port = 3010;

// Configure Sessions Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000
    } // 1 hour
}));

// Configure More Middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Error Messages
let emailErr = '&nbsp <i class="fa-solid fa-triangle-exclamation"></i> That email is taken.'
let usernameErr = '&nbsp <i class="fa-solid fa-triangle-exclamation"></i> That username is taken.'
let passErrorMsg = '<i class="fa-solid fa-triangle-exclamation"></i> Invalid password, Try again'
let InvalidEmailMsg = '<i class="fa-solid fa-triangle-exclamation"></i> Invalid email, Try again'


// Login route
app.
route('/')
    .get((req, res) => {
        res.render('login', {
            'error': ''
        });
    })
    .post((req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err)
            }

            if (!user) {
                return res.render('login', {
                    'error': passErrorMsg
                })
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err)
                }
                return res.redirect('/home')
            })
        })(req, res, next);
    });

// Signup route
app.get('/signup', (req, res) => {
    res.render('signup', {
        'error': '',
        'pass_error': '',
        'usernameErr': ''
    });
})
app.post('/signup', (req, res) => {
    User.find({
        email: req.body.email
    }, (err, docs) => {
        if (docs.length) {
            res.render('signup', {
                'error': emailErr,
                'pass_error': '',
                'usernameErr': ''
            })
            console.log('user exists')
        } else {
            User.find({
                username: req.body.username
            }, async (err, docs) => {
                if (docs.length) {
                    res.render('signup', {
                        'error': '',
                        'usernameErr': usernameErr,
                        'pass_error': ''
                    })
                    console.log('user exists')
                } else {
                    await User.register({
                            email: req.body.username,
                            username: req.body.email,
                            raw_password: req.body.password
                        },
                        req.body.password);
                    res.redirect('/')
                }
            });
        }
    })
})

// secret route
// app.get('/dashboard', (req, res) => {
//     if (req.isAuthenticated()) {
//         res.send(`Hello ${req.user.username}. Your session ID is ${req.sessionID} 
//         and your session expires in ${req.session.cookie.maxAge} milliseconds.<br><br>
//         <a href="/logout">Log Out</a><br><br><a href="/home">Members Only</a>`);
//     } else {
//         res.redirect('/')
//     }

// })

app.get('/home', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('home')
    } else {
        res.redirect('/')
    }

})

app.get('/logout', (req, res) => {
    req.logout;
    res.redirect('/')
})

app.listen(process.env.YOUR_PORT || process.env.PORT || port, () => {
    console.log('Listening to server on port ' + port)
})