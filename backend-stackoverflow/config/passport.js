const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const avatar = profile.photos?.[0]?.value;
        const username = profile.displayName;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ username, email, avatar, googleId, password: 'oauth_google' });
        } else {
            if (!user.googleId) user.googleId = googleId;
            if (!user.avatar) user.avatar = avatar;
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));


// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
        const githubId = profile.id;
        const avatar = profile.photos?.[0]?.value;
        const username = profile.displayName || profile.username;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ username, email, avatar, githubId, password: 'oauth_github' });
        } else {
            if (!user.githubId) user.githubId = githubId;
            if (!user.avatar) user.avatar = avatar;
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Serialize/deserialize (bắt buộc cho Passport, không dùng session)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));

module.exports = passport;
