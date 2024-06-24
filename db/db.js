const mongoose = require('mongoose')

async function db() {
    mongoose.connect('mongodb://localhost:27017/interviewdb').then((res) => {
        console.log('Database Connected');
    }).catch((err) => {
        console.log(`Db Error : Databse not connected`);
    })
}

db()