const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const Account = require('../models/accountModel')
const Film = require('../models/filmModel')
const nodemailer = require('nodemailer');
const { model } = require('mongoose');

function isLogin(req) {
    return req.isAuthenticated()
}

let filter = null

module.exports.login = async (req, res) => {
    //check user
    if (isLogin(req)) {
        const user = await Account.findOne({ id: req.user.id })
        return user.role == 'user' ? res.redirect('/home') : res.redirect('/admin')
    } else {
        return res.render('login', { csrfToken: req.csrfToken() })
    }
}
module.exports.register = async (req, res) => {
    if (isLogin(req)) {
        const user = await Account.findOne({ id: req.user.id })
        return user.role == 'user' ? res.redirect('/home') : res.redirect('/admin')
    }
    return res.render('login', { csrfToken: req.csrfToken() })
}

module.exports.forgot = async (req, res) => {
    return res.render('user/forgot', { csrfToken: req.csrfToken() })
}

module.exports.sendOTP = async (req, res) => {
    const userEmail = req.body.email;
    try {
        const accountEmail = await Account.findOne({ email: userEmail })
        if (!accountEmail) {
            return res.status(404).json({ message: 'Invalid email!' })
        }
        const OTP = Math.floor(Math.random() * 999999) + 100000;

        accountEmail.OTP = OTP;
        await accountEmail.save();

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kksoftwarelanguagecenter@gmail.com',
                pass: 'plffbgscyaylniio'
            }
        });

        let mailOptions = {
            from: 'movie@gmail.com',
            to: userEmail,
            subject: 'WEBFILM: Password Reset',
            text: 'Please click the link below to reset your password:',
            html: `Your OTP code is: <b> ${OTP} </b>`
        };

        let info = await transporter.sendMail(mailOptions);

        return res.status(200).json({ msg: 'Email sent. Please check your inbox.' })
    } catch (err) {
        return res.status(404).json({ err: 'Something was wrong!' })
    }
}

module.exports.post_forgot = async (req, res) => {
    const { email, OTP, password } = req.body
    try {
        const accountEmail = await Account.findOne({ email: email })
        if (!accountEmail) {
            return res.status(404).json({ err: 'Invalid email!' })
        }
        if (OTP == accountEmail.OTP) {
            accountEmail.password = bcrypt.hashSync(password, salt)
            await accountEmail.save()
            return res.status(200).json({ msg: 'Change password successful!' })
        }
        return res.status(404).json({ err: 'OTP invalid!' })
    } catch (err) {
        return res.status(404).json({ err: 'Something was wrong!' })
    }
}

module.exports.post_register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const account = await Account.findOne({ "$or": [{ username: username, email: email }] })
        if (account) {
            return res.status(401).json({ err: 'Account already exists!' })
        }
        const newAcc = new Account({
            id: await Account.countDocuments(),
            username: username,
            email: email,
            password: bcrypt.hashSync(password, salt)
        })
        await newAcc.save()
        return res.status(200).json({ msg: 'Register successful!' })
    } catch (err) {
        return res.status(400).json({ err: 'Something was wrong!' })
    }
}
//home user --> film
module.exports.home_user = async (req, res) => {
    try {
        const films_suggest = await Film.find().sort({ rating: -1 }).limit(6).exec();
        const films_newest = await Film.find().sort({ year: -1 }).limit(6).exec()
        if (isLogin(req)) {
            if (req.user.role == 'user' || req.user.provider != 'local') {
                const user = await Account.findOne({ id: req.user.id })
                return res.render('user/home', { films_suggest: films_suggest, films_newest: films_newest, user: user });
            }
            return res.redirect('/logout')
        }
        return res.render('user/home', { films_suggest: films_suggest, films_newest: films_newest })
    } catch (error) {
        return res.redirect('/login')
    }
};
//GET FILM (all or filtered)
module.exports.film = async (req, res) => {
    let genres = await Film.aggregate([
        { $unwind: '$genre' },
        { $group: { _id: '$genre' } },
        { $sort: { _id: 1 } }
    ])
    genres = genres.map(genre => genre._id)
    let user = null
    if (isLogin(req)) {
        if (req.user.role == 'user' || req.user.provider != 'local') {
            user = await Account.findOne({ id: req.user.id })
        } else {
            return res.redirect('/logout')
        }
    }
    if (filter) {
        let genrechoosen = filter.genre
        let films = filter.films
        let year = filter.year
        let age = filter.age
        let rating = filter.rating
        filter = null
        return res.render('user/films', { user: user, films: films, genres: genres, year: year, age: age, rating: rating, genrechoosen: genrechoosen, filter: true, csrfToken: req.csrfToken() })
    }
    const films = await Film.find()
    return res.render('user/films', { user: user, films: films, genres: genres, csrfToken: req.csrfToken() })
}
//FILTER
module.exports.post_film = async (req, res) => {
    const { genre, minYear, maxYear, minAge, maxAge, minRating, maxRating } = req.body
    let query = {}
    if (genre !== '') {
        query.genre = { $in: [genre] }
    }
    if (minYear !== undefined && maxYear !== undefined) {
        query.year = { $gte: parseInt(minYear), $lte: parseInt(maxYear) }
    }
    if (minAge !== undefined && maxAge !== undefined) {
        query.age = { $gte: parseInt(minAge), $lte: parseInt(maxAge) }
    }
    const films = await Film.aggregate([
        {
            $match: query
        },
        {
            $addFields: {
                avgRating: { $avg: "$rating" }
            }
        },
        {
            $match: {
                avgRating: { $gte: parseFloat(minRating) || 0.0, $lte: parseFloat(maxRating) || 10.0 }
            }
        }
    ]);
    filter = {
        genre: genre,
        films: films,
        year: minYear ? {
            min: minYear,
            max: maxYear
        } : null,
        age: minAge ? {
            min: minAge,
            max: maxAge
        } : null,
        rating: minRating ? {
            min: minRating,
            max: maxRating
        } : null
    }
    return res.status(200).json({ message: 'Filter successful!' })
}

module.exports.favorite = async (req, res) => {
    if (isLogin(req)) {
        if (req.user.role == 'user' || req.user.provider != 'local') {
            const user = await Account.findOne({ id: req.user.id })
            const film = await Film.find({ id: { $in: user.favorite } })
            return res.render('user/favorite', { user: user, film: film })
        }
        return res.redirect('/logout')
    } else {
        return res.render('user/favorite')
    }
}

module.exports.updateAccount = async (req, res) => {
    if (isLogin(req)) {
        if (req.user.role == 'user' || req.user.provider != 'local') {
            const user = await Account.findOne({ id: req.user.id })
            return res.render('user/updateAccount', { username: user.username, email: user.email, csrfToken: req.csrfToken() })
        }
        return res.redirect('/logout')
    } else {
        return res.render('user/home')
    }
}

module.exports.put_updateAccount = async (req, res) => {
    const { curpass, password } = req.body
    try {
        const user = await Account.findOne({ id: req.user.id })
        const compare = bcrypt.compareSync(curpass, user.password)
        if (compare) {
            user.password = bcrypt.hashSync(password, salt)
            await user.save()
            req.logout()
            return res.status(200).json({ msg: 'Change password successful!' })
        }
        else {
            res.status(404).json({ err: 'Current password not match!' })
        }
    } catch (err) {
        return res.status(404).json({ err: 'Something was wrong!' })
    }
}

module.exports.search = async (req, res) => {
    const search = req.body.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    const film = await Film.find({ name: { $regex: search, $options: 'i' } });
    if(isLogin(req)){
        if (req.user.role == 'user' || req.user.provider != 'local') {
        const user = await Account.findOne({ id: req.user.id })
        return res.render('user/search', { user: user, film: film })
        }
        return res.redirect('/logout')
    }
    return res.render('user/search', { film: film })
}

module.exports.logout = (req, res) => {
    req.logout()
    req.session.destroy
    return res.redirect('/login')
}

module.exports.success = async (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/callback/failure');
    }
    const result = await Account.findOne({ id: req.user.id })
    if (!result) {
        const u = new Account({
            id: req.user.id,
            username: req.user.displayName,
            // login with FB (perhaps email is undefined -> get id of account for email to process incase forgot password login with local)
            email: req.user.provider == 'google' ? req.user.emails[0].value : req.user.id,
            provider: req.user.provider
        })
        await u.save()
    }
    return res.redirect('/home');
}
module.exports.failure = (req, res) => {
    res.redirect("/login");
}

module.exports.successLocal = (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/local/failure');
    }
    return res.status(200).json({ msg: "Login successful!" })
}
module.exports.failureLocal = (req, res) => {
    return res.status(404).json({ err: "Invalid username or password!" })
}
//get film detail
module.exports.getDetailFilm = async (req, res) => {
    const id = req.params.id
    const film = await Film.findOne({ id: id })
    const filmSuggest = await Film.find({ genre: { $in: film.genre }, id: { $ne: id } }).limit(12)
    if (isLogin(req)) {
        if (req.user.role == 'user' || req.user.provider != 'local') {
            const user = await Account.findOne({ id: req.user.id })
            if (!user) {
                return res.render('user/details', { film: film, filmSuggest: filmSuggest, csrfToken: req.csrfToken() })
            }
            if (!film) {
                return res.render('user/films', { user: user, msg: "Film Not Found!", csrfToken: req.csrfToken() })
            }
            const isFavorite = user.favorite.includes(id)
            return res.render('user/details', { film: film, filmSuggest: filmSuggest, user: user, favorite: isFavorite ? "checked" : "none", csrfToken: req.csrfToken() })
        }
        return res.redirect('/logout')
    }
    return res.render('user/details', { film: film, filmSuggest: filmSuggest, csrfToken: req.csrfToken() })
}
//add favorite
module.exports.add_favorite = async (req, res) => {
    const { id, favorite } = req.body
    if (isLogin(req)) {
        if (req.user.role == 'user' || req.user.provider != 'local') {
            const user = await Account.findOne({ id: req.user.id })
            //true -> add
            if (favorite) {
                const isFavorite = user.favorite.includes(id)
                // already exists
                if (isFavorite) {
                    return res.status(400).json({ err: "Already added!" })
                }
                user.favorite.push(id)
                await user.save()

                return res.status(200).json({ msg: "Added successful!" })
            }
            //false -> remove
            if (!favorite) {
                const isFavorite = user.favorite.includes(id)
                // no exists
                if (!isFavorite) {
                    return res.status(400).json({ err: "No exists!" })
                }
                user.favorite = user.favorite.filter((item) => item != id)
                await user.save()

                return res.status(200).json({ msg: "Remove successful!" })
            }
        }
        return res.redirect('/logout')
    }
    return res.status(400).json({ err: "Login to bookmark!" })
}
//RATING
module.exports.rating = async (req, res) => {
    if (isLogin(req)) {
        if (req.user.role == 'user' || req.user.provider != 'local') {
            const { score, id } = req.body
            const film = await Film.findOne({ id: id })
            if (film) {
                film.rating.push(parseInt(score))
                await film.save()
                return res.status(200).json({ msg: "Rating successful!" })
            }
            return res.status(400).json({ err: "Rating failure!" })
        }
        return res.redirect('/logout')
    }
    return res.status(400).json({ err: "Login to rating!" })
}
//COMMENT
module.exports.comment = async (req, res) => {
    const { id, username, content, time } = req.body
    if (isLogin(req)) {
        if (req.user.role == 'user' || req.user.provider != 'local') {
            const film = await Film.findOne({ id: id })
            if (film) {
                film.cmt.unshift({ username: username, content: content, time: time })
                await film.save()
                return res.status(200).json({ msg: "Comment successful!" })
            }
            return res.status(400).json({ err: "Film not found!" })
        }
        return res.redirect('/logout')
    }
    return res.status(400).json({ err: "Login to comment!" })
}
