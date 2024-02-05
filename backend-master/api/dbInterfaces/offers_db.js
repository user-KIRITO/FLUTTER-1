const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    offerName: String, 
    imageURL: String,
    offerLink: String,
});

const offersDb = mongoose.model('in-app-offers', offerSchema);

async function createCarousalOffer({ imageURL, offerLink }) {

    const result = await offersDb.create({
        offerName: 'carousal',
        imageURL: imageURL,
        offerLink: offerLink,
    });
}   


async function getCarousalOffer() {

    const result = await offersDb.find({
        offerName: 'carousal'
    });

    return result;
}

async function deleteOffer({ id }) {

    const result = await offersDb.findByIdAndDelete(id);
    return result;
}

module.exports = {
    getCarousalOffer,
    createCarousalOffer,
    deleteOffer,
}