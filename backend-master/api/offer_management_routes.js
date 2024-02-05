const express = require("express");
const offerRouter = express.Router();
const multer = require('multer');

// import db
const offersDb = require('./dbInterfaces/offers_db');

const cdn = require('./cdn');

// multer
const upload = multer({ dest: 'image_uploads/' });

offerRouter.use(express.json());

offerRouter.get('/t', (req, res) => {

    res.json({
        message: 'Hello from offers'
    })
});

offerRouter.get('/getCarousal', async (req, res) => {
    
    try {

        const result = await offersDb.getCarousalOffer();
        res.json(result);
    }   
    catch(e) {
        console.log(e);
        res.status(500).json(e);
    }
})


offerRouter.post('/createOffer' ,upload.single('image'), async (req, res) => {

    try {
        
        const offerLink = '';
        const cdnResult = await cdn.uploadImageCdn(req.file.filename);
        const finalRes = await offersDb.createCarousalOffer({
            imageURL: cdnResult.url,
            offerLink: offerLink
        });

        res.json({
            info:'Image added successfully'
        });
    }
    catch(e) {
        console.log(e);
        res.status(500).json(e);
    }
});

offerRouter.delete('/deleteOffer', async (req, res) => {

    try {
        const id = req.query.id;
        const result = await offersDb.deleteOffer({ id: id });
        res.json({
            info: 'Offer deleted success'
        });

    }
    catch(e) {
        console.log(e);
        res.status(500).json(e);
    }
});



module.exports = offerRouter;