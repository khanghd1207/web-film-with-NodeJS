const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const data = require('../database.json')

const accountSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String
    },
    OTP: {
        type: Number,
        default: null
    },
    favorite: {
        type: [],
        default: []
    },
    provider: {
        type: String,
        default: 'local'
    }
})

const account = mongoose.model('Account', accountSchema)
//for dev
const accounts = data.filter(item=>item.hasOwnProperty('username'))
async function importData() {
    try {
        var count = 0
        for(let i = 0; i<accounts.length; i++){
            const acc = accounts[i]
            const existingAcc = await account.findOne({
                username: acc.username,
                role: acc.role
            })
            if(!existingAcc){
                const new_acc = new account({
                    id: await account.countDocuments(),
                    username: acc.username,
                    password: bcrypt.hashSync(acc.password, salt),
                    email: acc.email,
                    provider: acc.provider,
                    role: acc.role
                })
                await new_acc.save()
            }
            else{
                count++
            }
        }
        console.log(`${accounts.length - count} accounts import successful!`)
        console.log(`${count} accounts already exists!`)
    } catch (error) {
        console.log('Error import accounts: ', error);
    }
}
importData()
module.exports = account