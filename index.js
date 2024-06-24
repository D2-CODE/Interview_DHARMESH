
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
const ejs = require('ejs')
const port = 3001

//database connection
require('./db/db')


app.use(express.json())
app.use(bodyParser.json())
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

//geting models 

const City = require('./model/city.model')
const User = require('./model/user.model')


app.get('/', async (req, res) => {
    try {

        const users = await User.find()

        if (users.length == 0) {
            return res.status(400).json({
                code: 400,
                msg: 'Users Not Found'
            })
        }

        res.status(200).render('userlist', {
            code: 200,
            Users: users,
            length: users.length
        })

    } catch (err) {
        res.status(500).json({
            code: 500,
            msg: `Server Error`,
            error: err
        })
    }
})

app.get('/user/:id', async (req, res) => {
    try {

        const id = req.params.id
        const users = await User.findById(id)

        if (users.length == 0) {
            return res.status(400).json({
                code: 400,
                msg: 'Users Not Found'
            })
        }

        res.status(200).render('userUpdate', {
            code: 200,
            Users: users
        })

    } catch (err) {
        res.status(500).json({
            code: 500,
            msg: `Server Error`,
            error: err
        })
    }
})

//post city details

app.post('/city', async (req, res) => {

    const cityname = req.body.city;

    //City name should allow only Alphabets in upper/ small case.
    //City name should not allow numeric / special characters.

    //try to check name should be only in alfabet



    if (!cityname || !/^[A-Za-z]+$/.test(cityname)) {
        //send error code 
        return res.status(300).json({
            code: 300,
            msg: "city name contains numeric characters"
        })
    }

    try {
        const city = new City({ name: cityname })

        //save it

        await city.save()
        res.status(200).json({
            code: 200,
            msg: "city name inserted "
        })
    } catch (err) {

        //if catch server error

        if (err.code === 11000) {
            res.status(400).json({
                code: 400,
                msg: `Duplicate Error: City Name alredy Exits`,
            })
        } else {
            res.status(500).json({
                code: 500,
                msg: `Server Error`,
                error: err
            })
        }


    }
    // res.send('city contain only aflabet')
})


//City Get

app.get('/city', async (req, res) => {

    try {

        //get all cities

        const Cities = await City.find()

        if (!Cities) {
            return res.json({
                code: 300,
                msg: 'Cities Not Found'
            })
        }
        res.json({
            code: 200,
            cities: Cities,
            length: Cities.length
        })

    } catch (error) {
        res.status(500).json({
            code: 500,
            msg: `Server Error`,
            error: err
        })
    }

})

// City Task Compeleted



//Consume 3rd Party API
//Run this API https://api.binance.com/api/v1/time
//Console the Output in terminal

//can i do with app->not working

let serverTime;

axios.get('https://api.binance.com/api/v1/time').then(res => {
    console.log("ServerTime:", res.data.serverTime);
    serverTime = res.data.serverTime
}).catch((err) => {
    console.log(err);
})



// User Api 

app.post('/user', async (req, res) => {

    const { name, city, mobile, mediaurl } = req.body

    // validations

    if (!name || !/^[A-Za-z]+$/.test(name)) {
        return res.status(400).json({
            eror: 'name must only contain alfabets'
        })
    }

    // check city is exist or not 

    const CityExist = await City.findOne({ name: city })
    if (!CityExist) {
        return res.status(400).json({
            eror: 'City must only that is saved in database'
        })
    }

    if (mobile && !/^[0-9]*$/.test(mobile)) {
        return res.status(400).json({
            eror: 'mobile must only contain numbers'
        })
    }

    if (mediaurl && !/^https:\/\/.*/.test(mediaurl)) {
        return res.status(400).json({
            eror: 'media url must only start with https://'
        })
    }

    try {
        const newUser = new User({
            _id: serverTime,
            name,
            mobile,
            city,
            mediaurl
        })

        await newUser.save()

        res.status(200).json({
            code: 200,
            msg: 'User Added Suuccessfully',
            user: newUser
        })

    } catch (err) {
        res.status(500).json({
            code: 500,
            msg: `Server Error`,
            error: err
        })
    }
})


//Get USer details json object

app.get('/user', async (req, res) => {
    try {

        const users = await User.find()

        if (users.length == 0) {
            return res.status(400).json({
                code: 400,
                msg: 'Users Not Found'
            })
        }

        res.status(200).json({
            code: 200,
            Users: users,
            length: users.length
        })

    } catch (err) {
        res.status(500).json({
            code: 500,
            msg: `Server Error`,
            error: err
        })
    }
})


app.patch('/user/:id', async (req, res) => {

    const id = req.params.id
    const { name, city, mobile, mediaurl } = req.body
    //post validation repeted

    if (name && !/^[A-Za-z]+$/.test(name)) {
        return res.status(400).json({
            eror: 'name must only contain alfabets'
        })
    }

    // check city is exist or not 

    if (city) {
        const CityExist = await City.findOne({ name: city })
        if (!CityExist) {
            return res.status(400).json({
                eror: 'City must only that is saved in database'
            })
        }
    }

    if (mobile && !/^[0-9]*$/.test(mobile)) {
        return res.status(400).json({
            eror: 'mobile must only contain numbers'
        })
    }

    if (mediaurl && !/^https:\/\/.*/.test(mediaurl)) {
        return res.status(400).json({
            eror: 'media url must only start with https://'
        })
    }

    try {

        //check if user is exist or not

        const user = await User.findById(id)

        if (!user) {
            return res.status(400).json({
                code: 400,
                msg: 'User Not Found'
            })
        }

        if (name) {
            user.name = name
        }
        if (city) {
            user.city = city
        }
        if (mobile) {
            user.mobile = mobile
        }
        if (mediaurl) {
            user.mediaurl = mediaurl
        }

        await user.save()

        res.status(200).json({
            code: 200,
            msg: 'user Updated Successful',
            user: user
        })

    } catch (err) {
        res.status(500).json({
            code: 500,
            msg: `Server Error`,
            error: err
        })
    }

})


app.post('/userUpdate', async (req, res) => {

    const { id, name, city, mobile, mediaurl } = req.body
    //post validation repeted

    if (name && !/^[A-Za-z]+$/.test(name)) {
        return res.status(400).json({
            eror: 'name must only contain alfabets'
        })
    }

    // check city is exist or not 

    if (city) {
        const CityExist = await City.findOne({ name: city })
        if (!CityExist) {
            return res.status(400).json({
                eror: 'City must only that is saved in database'
            })
        }
    }

    if (mobile && !/^[0-9]*$/.test(mobile)) {
        return res.status(400).json({
            eror: 'mobile must only contain numbers'
        })
    }

    if (mediaurl && !/^https:\/\/.*/.test(mediaurl)) {
        return res.status(400).json({
            eror: 'media url must only start with https://'
        })
    }

    try {

        //check if user is exist or not

        const user = await User.findById(id)

        if (!user) {
            return res.status(400).json({
                code: 400,
                msg: 'User Not Found'
            })
        }

        if (name) {
            user.name = name
        }
        if (city) {
            user.city = city
        }
        if (mobile) {
            user.mobile = mobile
        }
        if (mediaurl) {
            user.mediaurl = mediaurl
        }

        await user.save()

        res.status(200).redirect('/')

    } catch (err) {
        res.status(500).json({
            code: 500,
            msg: `Server Error`,
            error: err
        })
    }

})

app.listen(port, () => {
    console.log(`app listing on ${port}`);
})