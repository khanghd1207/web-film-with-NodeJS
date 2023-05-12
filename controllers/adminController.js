const Film = require('../models/filmModel')
const Account = require('../models/accountModel')
function isLogin(req) {
    return req.isAuthenticated() && req.user.role == 'admin'
}

module.exports.manage_genre = async (req, res) => {
    console.log(req.user)
    if (isLogin(req)) {
        let genres = await Film.aggregate([
            { $unwind: '$genre' },
            { $group: { _id: '$genre' } },
            { $sort: { _id: 1 } }
        ])
        user = await Account.findOne({ id: req.user.id, role : req.user.role })
        genres = genres.map(genre => genre._id)
        return res.render('admin/genre', { user: user, genres: genres, csrfToken: req.csrfToken() , layout:'adminlayout' })
    }
    return res.redirect('/login')
}
module.exports.put_genre = (req, res) => {
    if (isLogin(req)) {
        const { old_genre, new_genre } = req.body
        Film.updateMany({ genre: old_genre }, { $set: { genre: new_genre } })
            .then(result => {
                console.log(result.modifiedCount + " documents updated");
                res.status(200).json({ msg: "Update successful!" });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ err: "Update failure!" });
            });
    }
    return res.redirect('/login')
}
module.exports.del_genre = async (req, res) => {
    if (isLogin(req)) {
        const { genre } = req.body
        console.log(genre)
        try {
            const result = await Film.updateMany(
                { genre: genre }, // select all films that have the genre in the genres array
                { $pull: { genre: genre } } // remove the genre from the genres array
            );
            console.log(`${result.modifiedCount} films updated`); // log the number of films updated
            return res.status(200).json({ msg: "Delete successful!" })
        } catch (error) {
            console.error(error);
            return res.status(400).json({ err: "Delete failure!" })
        }
    }
    return res.redirect('/login')
}
module.exports.get_list_film = async (req, res) => {
    if (isLogin(req)) {
        const user = await Account.findOne({ id: req.user.id, role : req.user.role })
        const step = 10
        const page = req.query.page || 1
        const length = await Film.countDocuments()
        const list_films = await Film.find().skip((page - 1) * step).limit(step).exec()
        return res.render('admin/comment', { user: user, length: length, list_films: list_films  , layout:'adminlayout'})
    }
    return res.redirect('/login')
}
module.exports.get_detail_cmt = async (req, res) => {
    if (isLogin(req)) {
        const user = await Account.findOne({ id: req.user.id, role : req.user.role })
        const { id } = req.params
        const film = await Film.findOne({ id: id })
        if (film) {
            return res.render('admin/comment', { user: user, film: film, csrfToken: req.csrfToken() , layout:'adminlayout' })
        }
        else {
            return res.redirect('admin/comment')
        }
    }
    return res.redirect('/login')
}
module.exports.del_cmt = async (req, res) => {
    if (isLogin(req)) {
        try {
            const { idCmt, idFilm } = req.body
            await Film.updateOne(
                { id: idFilm },
                { $pull: { cmt: { _id: idCmt } } }
            );
            return res.status(200).json({ msg: "Delete successful!" })
        } catch (err) {
            console.log(err)
            return res.status(400).json({ err: "Delete failure!" })
        }
    }
    return res.status(400).json({ err: "Delete failure!" })
}

module.exports.userList = async (req, res) => {
    if (isLogin(req)) {
        const user = await Account.findOne({ id: req.user.id, role: req.user.role })
        const step = 10
        const page = req.query.page || 1
        const length = await Account.countDocuments()
        const list_users = await Account.find({id: { $nin: user.id } }).skip((page - 1) * step).limit(step).exec()
        return res.render('admin/user', { user, length, list_users, page, csrfToken: req.csrfToken(), layout:'adminlayout'})
    }
    return res.redirect('/login')

}

module.exports.del_user = async (req, res) => {
    if (isLogin(req)) {
        try {
            const { id } = req.body
            await Account.deleteOne({ id });
            return res.status(200).json({ msg: "Delete successful!" })
        } catch (err) {
            console.log(err)
            return res.status(400).json({ err: "Delete failure!" })
        }
    }
    return res.status(400).json({ err: "Delete failure!" })

}
module.exports.get_detail_user = async (req, res) => {
    if (isLogin(req)) {
        const user = await Account.findOne({ id: req.user.id, role: req.user.role })
        const { id } = req.params
        const thatuser = await Account.findOne({ id})
        return res.render('admin/edituser', { user, thatuser, csrfToken: req.csrfToken() , layout:'adminlayout'})
    }
    return res.redirect('/login')
}

module.exports.put_user = async (req, res) => {
    if (isLogin(req)) {
        const { id, update } = req.body
        await Account.findOneAndUpdate({id}, update)
            .then(result => {
                console.log(result.modifiedCount + " documents updated");
                res.status(200).json({ msg: "Update successful!" });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ err: "Update failure!" });
            });

    }
    return res.redirect('/login')
}

module.exports.manage_film = async (req, res) => {
    if (isLogin(req)) {
        const user = await Account.findOne({ id: req.user.id, role: req.user.role })
        const step = 10
        const page = req.query.page || 1
        const length = await Film.countDocuments()
        const list_films = await Film.find().skip((page - 1) * step).limit(step).exec()

        return res.render('admin/film', { user, length, list_films, currentpage: page, csrfToken: req.csrfToken(),  layout:'adminlayout'})
    }
    return res.redirect('/login')
}
module.exports.del_film = async (req, res) => {
    const { id } = req.body
    const result = await Film.findOneAndDelete({ id: id })
    console.log(result)
    if (result) {
        return res.status(200).json({ msg: "Delete successful!" })
    }
    return res.status(400).json({ err: "Delete failure!" })
}
module.exports.detail_film = async (req, res) => {
    const { id } = req.params
    const film = await Film.findOne({ id: id })
    if (film) {
        return res.status(200).json({ film: film })
    }
    return res.status(400).json({ err: "Error!" })
}