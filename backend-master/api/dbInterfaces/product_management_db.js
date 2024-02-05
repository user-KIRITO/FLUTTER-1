require('dotenv').config();

// import the connected mongoose instance from dbConnector js
const dbConnector = require('./dbConnector');

// Then define mongoose as the connected mongoose from dbConnector
const mongoose = dbConnector.mongoose;


// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true })
    .then(console.log('connected to atlas'))


// Database Schema Definition for Products
const dbSchemaDef = mongoose.Schema({

    productName: String,
    qty: Number,
    price: { type: Number, float: true },
    category: String,
    description: String,
    images: {type: [String], required: false},
    urlKey: { type: String, required: false },
    metaTitle: { type: String, required: false },
    metaKeyWords: {type: [String], required: false},
    meteDescription: {type: String, required: false},
    status: Boolean,
    visibility: Boolean,
    stockAvailable: Boolean

});



const productSchema = mongoose.model('product', dbSchemaDef); // Creates(if not present) or opens the model in DB


function addProduct( {productName, qty, price, category, description, urlKey, metaTitle, metaKeyWords, metaDescription, status, visibility, stockAvailable } ){
   
    return productSchema.create({
        productName: productName,
        qty: parseInt(qty),
        price: parseFloat(price),
        category: category,
        description: description,
        images: [], // imageArray is null when product is first created. Then uses addImage to Add URLs
        urlKey: urlKey,
        metaTitle: metaTitle,
        metaKeyWords: metaKeyWords,
        metaDescription: metaDescription,
        status: Boolean(status),
        visibility: Boolean(visibility),
        stockAvailable: Boolean(stockAvailable),
    });
}


// this route make us of document_id in the db to uniquely identify each products
async function addImagesToProduct({ id, imgUrl }) {
    try {
      const product = await productSchema.findOneAndUpdate(
        { _id: id }, // Select the Product by id
        { images: imgUrl }, // Update the images array with urls from CDN
        { new: true } // Return the updated document
      ).lean();
      return product;
    } catch (err) {
      console.error(err);
      return err;
      throw err;
    }
  }


// Searches for a given product in the DB
function searchProduct( {productName} ) {
    
    partialQuery = productName; // Make use of regex to match all occurences and cover all names
    return productSchema.find({
        productName: { $regex: partialQuery, $options: 'i' }
    });
}


// List all the products in the database
function listAllProducts () {

    return productSchema.find({})

}


// Updates the provided attributes of the product
async function updateProduct({ id, updateValues }){

    try {
        const product = await productSchema.findOneAndUpdate(
          { _id: id }, // Select the Product by id
          updateValues, // Update attributes according to the values from updateValues Object
          { new: true } // Return the updated document
        ).lean();
        return product;
      } catch (err) {
        console.error(err);
        return err;
        throw err;
      }

}

// Function Delete a particular product by _id from database.
async function deleteProduct( {id} ){

  try {
    const result = await productSchema.deleteOne(
      { _id: id }, // Select the Product by id
    ).lean();
    return result;
  } catch (err) {
    console.error(err);
    throw err;
    return err;
  }

}

// Export the functions for CRUD operations on DB
module.exports = {
  
    addProduct,
    listAllProducts,
    searchProduct,
    addImagesToProduct,
    updateProduct,
    deleteProduct,
};
