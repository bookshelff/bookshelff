const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');

// Aniket & Aditya's Project
const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory)||fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log',{
    interval:'1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: "CannotTellSry",
    db:  'social',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: 'false',
        auth: {
            user: '12john3doe21',
            pass: 'Pw123456'
        }
    },
    google_clientID: "120122670242-mhjvbvkag2kf44dguganvled3r9e7uga.apps.googleusercontent.com",
    google_clientSecret: "O_8Cx1EjMvuI7RH4kTzc6sh8",
    google_callbackURL: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'SorryCannotTellYou',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
};

const production = {
    name: 'production',
    asset_path: process.env.SOCIAL_ASSETS,
    session_cookie_key: process.env.SOCIAL_COOKIE_KEY,
    db:  process.env.SOCIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: 'false',
        auth: {
            user: '12john3doe21',
            pass: 'Pw123456'
        }
    },
    google_clientID: "120122670242-mhjvbvkag2kf44dguganvled3r9e7uga.apps.googleusercontent.com",
    google_clientSecret: "O_8Cx1EjMvuI7RH4kTzc6sh8",
    google_callbackURL: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'SorryCannotTellYou',
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
};

// module.exports = eval( (process.env.SOCIAL_ENVIRONMENT==undefined) ? "development" : eval(process.env.SOCIAL_ENVIRONMENT));
module.exports = development;