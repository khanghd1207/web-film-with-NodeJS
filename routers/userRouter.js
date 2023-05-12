const express = require('express')
const passport = require('passport');
const csrf = require('csurf')
let csrfProtection = csrf({ cookie: true });
const user = express()
const userController = require('../controllers/usersController')
require('../passport');
user.use(passport.initialize());
user.use(passport.session());
let flag = true
function test(req, res, next) {
    if (flag) {
        if (req.user) {
            req.logout()
            flag = false
            return next()
        }
        return next()
    }
    return next()
}
user.use(test)
user.get('/', csrfProtection, userController.login)
user.get('/login', csrfProtection, userController.login)
user.get('/register', csrfProtection, userController.register)
user.get('/forgot', csrfProtection, userController.forgot)
user.get('/logout', userController.logout)
user.get('/home', userController.home_user)
user.get('/film', csrfProtection, userController.film)
user.get('/favorite', userController.favorite)
user.get('/update-account', csrfProtection, userController.updateAccount)
user.get('/film/detail/:id', csrfProtection, userController.getDetailFilm)

user.get('/auth-google', passport.authenticate('google', { scope: ['email', 'profile'] }))
user.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure'
    }));
//----------------login Facebook----------------
user.get('/auth-facebook', passport.authenticate('facebook', { scope: 'email' }));
user.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure'
    }));
//----------------login local----------------
user.post('/auth/local', csrfProtection, passport.authenticate('local', { successRedirect: '/auth/local/success', failureRedirect: '/auth/local/failure' }));
//----------------local success----------------
user.get('/auth/local/success', userController.successLocal)
//----------------local Failure----------------
user.get('/auth/local/failure', userController.failureLocal)

//----------------success----------------
user.get('/auth/callback/success', userController.success)
//----------------Failure----------------
user.get('/auth/callback/failure', userController.failure)

user.post('/sendOTP', csrfProtection, userController.sendOTP)
user.post('/forgot', csrfProtection, userController.post_forgot)
user.post('/register', csrfProtection, userController.post_register)
user.post('/search', userController.search)
//filter
user.post('/film', csrfProtection, userController.post_film)
//add favorite
user.post('/addFavorite', csrfProtection, userController.add_favorite)
//rating
user.post('/film/rating', csrfProtection, userController.rating)
//
user.put('/update-account', csrfProtection, userController.put_updateAccount)
//cmt
user.post('/film/cmt', csrfProtection, userController.comment)
module.exports = user