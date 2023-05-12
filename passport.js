const passport = require('passport');
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const Account = require('./models/accountModel')
const dotenv = require('dotenv');
dotenv.config({ path: './env' });
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
})
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Your Credentials here.
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Credentials here.
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
},
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile)
  }
))


passport.use(new LocalStrategy(({
  usernameField: "displayName",
  passwordField: "password",
}), async (displayName, password, done) => {
  const result = await Account.findOne({username: displayName, provider: 'local'})
  if(result){
    const a = bcrypt.compareSync(password, result.password)
    if(a){
      return done(null, result)
    }
    return done(null, false)
  }
  return done(null, false)
  }
));