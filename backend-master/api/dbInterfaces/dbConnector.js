const mongoose = require('mongoose');
require('dotenv').config({path : './../../.env'});

mongoUri = process.env.MONGO_URI;
// Connect to MongoDB

mongoose.connect(mongoUri, { useNewUrlParser: true })
    .then(console.log('connected to atlas'));

// Then export the authenticated mongooese dbConnector;

module.exports = {
    mongoose
}