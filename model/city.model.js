//city model

const mongoose = require('mongoose')


//alfabate regrex = /^[A-Z][a-z]$/ 

const CitySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-Za-z]+$/,
    },
})

const city = mongoose.model('City', CitySchema)

module.exports = city