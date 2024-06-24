//user schema name city mobile media url

// ID parameter should take the value of Step 3, Output servertime.
// this id is object id that i have to change ? 1719224302408 this one? or it will be alternative field! hello sir aa ID ma Aj rite karva nu che?

const mongoose = require('mongoose')
const city = require('./city.model')

const UserSchema = new mongoose.Schema({

    _id: {
        type: Number,
        require: true,
        unique: true
    },
    name: {
        type: String,
        match: /^[A-Za-z]+$/,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        match: /^[0-9]*$/
    },
    mediaurl: {
        type: String,
        match: /^https:\/\/.*/
    },
})

const User = mongoose.model('User', UserSchema)

module.exports = User