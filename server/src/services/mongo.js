const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.on('error', (err) => {
        console.log(err);
    })

async function connectMongo() {
    try {
        await mongoose.connect(MONGO_URL);
    } catch (err) {
        console.log(err)
    }
}

async function disconnectMongo() {
    try {
        await mongoose.disconnect(MONGO_URL);
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    connectMongo,
    disconnectMongo
}
