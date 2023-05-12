const mongoose = require('mongoose')
// const autoIncrementModelID = require('./incrementModel')
const data = require('../database.json')
const filmChema = mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String
    },
    actor: [],
    director: {
        type: String
    },
    rating: {
        type: [],
        default: []
    },
    desc: {
        type: String
    },
    img: {
        type: String
    },
    source: {
        type: String
    },
    age: {
        type: Number
    },
    year: {
        type: Number
    },
    cmt: {
        type: [{
            username: String,
            content: String,
            time: String
        }],
        default: []
    },
    genre: []
})
const films = mongoose.model('Films', filmChema)
//for dev
const film = data.filter(item => item.hasOwnProperty('name'))
async function importData() {
    try {
        var count = 0
        for (let i = 0; i < film.length; i++) {
            const f = film[i]
            const existingFilm = await films.findOne({
                name: f.name,
                actor: { $all: f.actor },
                director: f.director,
                rating: { $all: f.rating },
                desc: f.desc,
                img: f.img,
                source: f.source,
                age: f.age,
                year: f.year,
                genre: { $all: f.genre }
            });
            if (!existingFilm) {
                const new_film = new films({
                    id: await films.countDocuments(),
                    name: f.name,
                    actor: f.actor,
                    director: f.director,
                    rating: f.rating,
                    desc: f.desc,
                    img: f.img,
                    source: f.source,
                    age: f.age,
                    year: f.year,
                    genre: f.genre
                })
                await new_film.save()
            }
            else {
                count++
            }
        }
        console.log(`${film.length - count} films import successful!`)
        console.log(`${count} films already exists!`)
    } catch (error) {
        console.log('Error import accounts: ', error);
    }
}
importData()
module.exports = films