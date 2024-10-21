const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect username.' });
        // Compare passwords (you will need to implement the password comparison)
        // If valid, return the user, otherwise return false.
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
