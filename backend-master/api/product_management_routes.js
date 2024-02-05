const express = require('express');
const productManagementRouter = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');


// Import CDN For Image Uploads
const cdn = require('./cdn');

const productManagementDb = require('./dbInterfaces/product_management_db');


// Destination to store the product images temporarily
const upload = multer({ dest: 'image_uploads/' });


productManagementRouter.use(bodyParser.json());

productManagementRouter.get('/', (req, res) => {

    res.json({
        message:"This is ecom backend"
    });    
});

// Route for listing all the products present in the database
// Response -> JSON Array with all products

productManagementRouter.get('/viewAllProducts', (req, res) => {
    
    productManagementDb.listAllProducts()
    .then( (data) => {
        res.json(data)
    } )
})


// Route for adding new product to database
productManagementRouter.post('/addProduct', (req, res) => {

    // Extracting the product attributes from request body
    const requestData = req.body;
    console.log(requestData);

    const result = productManagementDb.addProduct( {
        productName: requestData.productName,
        qty: requestData.qty,
        price: requestData.price,
        category: requestData.category,
        description: requestData.description,
        urlKey: requestData.urlKey,
        metaTitle: requestData.metaTitle,
        metaKeyWords: requestData.metaKeyWords,
        metaDescription: requestData.metaDescription,
        status: requestData.status,
        visibility: requestData.visibility,
        stockAvailable: requestData.stockAvailable,
        } ).then(( result )=>{
            res.json({
                info: 'Product Added Successfully',
                productDetails: result,

            })
        }).catch( (err) =>{
            res.json({
                info: 'Error Adding Product',
                errorMessage: err,
            })
        } )
    

})

productManagementRouter.post('/uploadImages', upload.array('image'), (req, res) => {

  
  async function uploadFiles(req) {
      let givenId = req.query.id; // Extract the id from the query parameter
        try {
          let imgUrlArray = []; // Holds the imageURL from CDN
          const files = req.files;
          for (const file of files) {
            console.log(file);
            const result = await cdn.uploadImageCdn(file.filename);
            
            await imgUrlArray.push(result.url)

          }
          console.log('done uploading');
          console.log(imgUrlArray);
          const cdnResult = productManagementDb.addImagesToProduct( {id: givenId, imgUrl: imgUrlArray} );
          res.json({
            info: 'Images Added Succesfully',
          });
        } catch (err) {
          res.json({
            info: 'Error Adding/Updating Images',
            errorMessage: err,
          })
        }
      }
      
      uploadFiles(req);

    });


// This route searches for a particular products and respond with an array of found products
productManagementRouter.post('/searchProduct', (req, res) => {

    productManagementDb.searchProduct( {productName: req.body.productName} )
    .then((result) => {
        res.json(result);
    })

})

// This route updates the provided attributes of the product
productManagementRouter.post('/updateProduct', (req, res) => {

  
  async function handleUpdate(req) {
      const givenId = req.query.id;
      try {

        const result = await productManagementDb.updateProduct({
          id: givenId,
          updateValues: 
          req.body
        })
        res.json({
          info: 'Updated Succesfully',
          result:result,
        })
      }
      catch (err){
        res.json({
          info: 'Error Updating Product',
          errorMessage: err,
        })
      }
    }

    handleUpdate(req);
})


// Route for deleting a particular product from the database using _id
productManagementRouter.post('/deleteProduct', (req, res) => {
  
  async function handleDelete(req) {
      const givenId = req.query.id;
      try {

        const result = await productManagementDb.deleteProduct({
          id: givenId,
        })
        res.json({
          info: 'Deleted Succesfully',
          result:result,
        })
      }
      catch (err){
        res.json({
          info: 'Error Deleting Product',
          errorMessage: err,
        })
      }
    }
    
    handleDelete(req);
})

module.exports = productManagementRouter;
