require('dotenv').config();

const { modelNames, model } = require('mongoose');
// import the connected mongoose instance from dbConnector js
const dbConnector = require('./dbConnector');
const { FindCursor } = require('mongodb');

// Then define mongoose as the connected mongoose from dbConnector
const mongoose = dbConnector.mongoose;


// Database Schema Definition for Repair Category
const repairCatSchemaDef = mongoose.Schema({

    categoryName: String,    // Name of the repair category
    imageURL: {type: String, required: false},          // Image URL of category
    categoryBrands: {type: [String], required: false}, // Stores the brands in each category
});

const repairBrandSchemaDef = mongoose.Schema({

    brandName: String,
    parentCategory: String,
    imageURL: {type: String, required: false},    // Name of the repair brand
    brandModels: {type: [String], required: false} // Stores all the product models that specific brand has
})

const repairModelSchemaDef = mongoose.Schema({

    modelName: String,  // Name of the model
    imageURL: String,
    parentBrand: String,
	parentCategory: String,
    modelDescription: String, // Short description of the model
    knownIssues:[String] // array of objects containing info about knownIssues
})

const repairIssueSchemaDef = mongoose.Schema({

	issueName: String,
	imageURL: String,
	parentModel: String,
	parentBrand: String,
	parentCategory: String,
	issueDescription: String,
	issueCost:  {type: Number, float: true},
})

const globalIssueSchemaDef = mongoose.Schema({
	issueName: String,
	issueDescription: String,
	imageURL: String,
});

const repairCatSchema = mongoose.model('repair-category', repairCatSchemaDef); // Creates(if not present) or opens the model in DB

const repairBrandSchema = mongoose.model('repair-brands', repairBrandSchemaDef);

const repairModelSchema = mongoose.model('repair-models', repairModelSchemaDef);

const repairIssueSchema = mongoose.model('repair-issues', repairIssueSchemaDef);

const globalIssueSchema = mongoose.model('global-issues',globalIssueSchemaDef);

async function addCategory({ categoryName }){
    
	const catResult = await repairCatSchema.create({
		categoryName: categoryName,
	});
		return catResult;
}   

async function addCategoryImage( { imageURL, id } ){
    
    try {
        const result = await repairCatSchema.findOneAndUpdate(
          { _id: id }, // Select the Category by id
          { imageURL: imageURL }, // Update the images array with urls from CDN
          { new: true } // Return the updated document
        ).lean();
        return result;
      } catch (err) {
        console.error(err);
        return err;
      }
    }


async function addModelImage( { imageURL, id } ){

    try {
        const result = await repairModelSchema.findOneAndUpdate(
          { _id: id }, // Select the Category by id
          { imageURL: imageURL }, // Update the images array with urls from CDN
          { new: true } // Return the updated document
        ).lean();
        return result;
      } catch (err) {
        console.error(err);
        return err;
      }
    }

async function addIssueImage( {imageURL, id} ){
	try {
		const issueRes = await globalIssueSchema.findByIdAndUpdate(id,{
			imageURL:  imageURL,
		}, {new : true}).lean();
		return issueRes
	}
	catch(e){
		console.log(e);
		return e;
	}
}

    
async function addBrandImage( { imageURL, id } ){

    try {
        const result = await repairBrandSchema.findOneAndUpdate(
          { _id: id }, // Select the Category by id
          { imageURL: imageURL }, // Update the images array with urls from CDN
          { new: true } // Return the updated document
        ).lean();
        return result;
    } catch (err) {
        console.error(err);
        return err;
        ;
    }
}
    


function listAllCategories(){
 
    return repairCatSchema.find({});   
    
}

async function deleteCategory( { givenId } ) {

	const catRes = await repairCatSchema.findById(givenId);
	
	const parentCategory = catRes.categoryName;
	const brandArr = catRes.categoryBrands;

	// use the category names to perform delete many 

	try {

		// delete the issues
		const issueDeleteRes = await repairIssueSchema.deleteMany({
			parentCategory: parentCategory,
		});

		// delete the models
		const modelDeleteRes = await repairModelSchema.deleteMany({
			parentCategory: parentCategory,
		})

		// delete the brand
		const brandDeleteRes = await repairBrandSchema.deleteMany({
			parentCategory: parentCategory,
		});

		// delete the category
		const catDeleteRes = await repairCatSchema.findByIdAndDelete(givenId);

		return {
			message: 'Category Deleted Successfully',
		}
	}
	catch(e) {
		return {
			error:'Error Deleting Category'
		}
	}


}

async function deleteBrand( { givenId } ) {

	const brandRes = await repairBrandSchema.findById(givenId);
	const brandName = brandRes.brandName;
	
	try {
		// Delete the issues
		const issueDeleteRes = await repairIssueSchema.deleteMany({
			parentBrand: brandName,
		});

		// delete the models
		const modelDeleteRes = await repairModelSchema.deleteMany({
			parentBrand: brandName,
		});

		// delete the brand
		const brandDeleteRes = await repairBrandSchema.findByIdAndDelete(givenId);

		return {
			message: 'Brand Deleted Successfully'
		}
	}
	catch(e) {
		console.log(e);
		return {
			error: 'Error Deleting Brand'
		}
	}
}


async function deleteModel( { modelId } ) {

	const modelRes = await repairModelSchema.findById(modelId);
	const modelName = modelRes.modelName;
	
	try {

		// delete the issues
		const issueDeleteRes = await repairIssueSchema.deleteMany({
			parentModel: modelName,
		});

		// delete the model
		const modelDeleteRes = await repairModelSchema.findByIdAndDelete(modelId);
		return {
			message: 'Model Deleted Successfully',
		}
	}
	catch(e) {
		console.log(e);
		return {
			error: 'Error in Deleting Model',
		}
	}
	
}

async function deleteIssue( {issueId }) {

	const issueDeleteRes = await repairIssueSchema.findByIdAndDelete(issueId);
	return {
		message: 'Issue Deleted Successfully',
	};
}

async function listBrands({ catId }){
	
	// fetch the category name from database
	const catRes = await repairCatSchema.findById(catId);
	
	return repairBrandSchema.find({
		parentCategory: catRes.categoryName
	}).lean();
}

async function listModels({ brandId }){

	// fetch the brand name from db
	const brandRes = await repairBrandSchema.findById(brandId);

	return repairModelSchema.find({
		parentCategory: brandRes.parentCategory,
		parentBrand: brandRes.brandName,
	});
}

async function addBrand({ catId, brandName }){

    // This requires two database updates
    const catRes = await repairCatSchema.findById(catId);
	
	// check if the array already has that brandName
	let  catBrands = catRes.categoryBrands;
	
	// add brandname to brandschema

	const brandRes = await repairBrandSchema.create({
		brandName: brandName,
		parentCategory: catRes.categoryName,
	});

	// now update the categoryBrand array
	catBrands.push(brandName);
	const finalRes = await repairCatSchema.findByIdAndUpdate(catId, {
		categoryBrands: catBrands,
	});

	return {
		message: 'Brand Added Successfully',
		result: brandRes,
	}
}


async function addModel({ brandId, modelName }){

	// fetch the brand 
	const brandRes = await repairBrandSchema.findById(brandId);
	
	// check if the model already exist in the database

	// add modelname to modelschema

	const modelRes = await repairModelSchema.create({
		modelName:modelName,
		parentBrand: brandRes.brandName,
		parentCategory: brandRes.parentCategory,
	});

	// push to model array of brandschema

	let modelArr = brandRes.brandModels;
	modelArr.push(modelName);
	const finalRes = await repairBrandSchema.findByIdAndUpdate(brandId, {
		brandModels: modelArr,
	});

	return {
		message: 'Model Added Successfully',
		result: modelRes,
	}
    
}

async function addModelIssues( { modelId, issueId, issueCost } ){

	// get the global issue
	const globalRes = await globalIssueSchema.findById(issueId);
	console.log(globalRes);

	// fetch the modelRes
	const modelRes = await repairModelSchema.findById(modelId);
	console.log(modelRes);

	// check if the issue already assigned to the model if then update

	const issueExists = await repairIssueSchema.find(
		{	issueName: globalRes.issueName,
			parentModel: modelRes.modelName,
			parentCategory: modelRes.parentCategory,
			parentBrand: modelRes.parentBrand,
		}

	)
	
	// copy the data to repair issue schema
	if(issueExists.length == 0) {

		const issueRes = await repairIssueSchema.create({
			issueCost: issueCost,
			issueName: globalRes.issueName,
			issueDescription: globalRes.issueDescription,
			imageURL: globalRes.imageURL,
			parentModel: modelRes.modelName,
			parentCategory: modelRes.parentCategory,
			parentBrand: modelRes.parentBrand,
		});
	}
	
	else {
		// update the previous issue
		await repairIssueSchema.findOneAndUpdate({
			issueName: globalRes.issueName,
			parentModel: modelRes.modelName,
			parentCategory: modelRes.parentCategory,
			parentBrand: modelRes.parentBrand,
		},
			{
				issueCost: issueCost,
				issueDescription: globalRes.issueDescription,
				imageURL: globalRes.imageURL,
			}
		)
	}
	
	//
	let issueArr = modelRes.knownIssues;
	issueArr.push(globalRes.issueName);
	const secRes = await repairModelSchema.findByIdAndUpdate(modelId, { knownIssues: issueArr } );

	return {
		message: "Issue Added Successfully",
		result: secRes,
	};
}

async function listAllIssues( { modelId } ) {

	// fetch the model from db
	const modelRes = await repairModelSchema.findById(modelId);

	console.log(modelRes);
	// fetch from issue schema
	const issueRes = await repairIssueSchema.find({
		parentBrand: modelRes.parentBrand,
		parentModel: modelRes.modelName,
	});

	return issueRes;
}

async function updateCategory({ givenId, categoryName }){

	const res = await repairCatSchema.findByIdAndUpdate(givenId, {
		categoryName: categoryName,
	});

	return res;
}

async function updateBrand({ givenId, brandName }){

	const res = await repairBrandSchema.findByIdAndUpdate(givenId, {
		brandName:brandName
	});
	return res;
}

async function updateModel({ givenId, modelName }){

	const res = await repairModelSchema.findByIdAndUpdate(givenId, {
		modelName: modelName
	});
	return res;
}

async function updateModelIssue({ issueId, reqBody }) {

	const issueRes = await repairIssueSchema.findByIdAndUpdate(issueId, reqBody);
	return {
		message: 'Issue Updated Successfully'
	}
}

async function addGlobalIssue( { issueName, issueDescription }) {

	const result = await globalIssueSchema.create({
		issueDescription: issueDescription,
		issueName: issueName,	
	});
	return result;
}

async function listGlobalIssues() {
	const result = await globalIssueSchema.find({});
	return result;
}

async function updateGlobalIssue({ reqBody, issueId }) {

	const result = await globalIssueSchema.findByIdAndUpdate(issueId, reqBody);
	return {
		message: 'Global Issue Updated Successfully',
	}
}
async function deleteGlobalIssue( { issueId} ) {

	const result = await globalIssueSchema.findByIdAndDelete(issueId);
	return {
		message: 'Global issue deleted successfully',
	};
}


async function getCatInfo({id}) {

	const res = await repairCatSchema.findById(id);
	return res.categoryName;
}
async function getBrandInfo({id}) {

	const res = await repairBrandSchema.findById(id);
	return res.brandName;
}
async function getModelInfo({id}) {

	const res = await repairModelSchema.findById(id);
	return res.modelName;
}

async function getModelIssueInfo({id}) {

	const res = await repairIssueSchema.findById(id);
	return res.issueName;
}

async function getIssueInfoFromName({ issueName, parentModel, parentBrand, parentCategory }) {

	console.log('called db func');
    const result = await repairIssueSchema.find({
		issueName: issueName,
		parentBrand: parentBrand,
		parentModel: parentModel,
		parentCategory: parentCategory
	});

	return result;
}

async function listAllModelIssuesAdmin({ modelId }) {

	// form an array of all the global issues in the db;
	const globalIssueList = await globalIssueSchema.find({});

	// use the list.issueName inside the modelIssues to find whether they already have a price or not
	let finalRes = []

	// get parentModel, parentCat and parentBrand from modelId
	const modelRes = await repairModelSchema.findById(modelId);
	// console.log(modelRes);

	// get all the issues in the db
	const totalIssues = await repairIssueSchema.find({
		parentCategory: modelRes.parentCategory,
		parentBrand: modelRes.parentBrand,
		parentModel: modelRes.modelName
	});

	// loop through each element in global issue list and match them in total issues

	globalIssueList.forEach(( globalIssue ) => {
		
		// see if issueName is in the totalIssues
		const foundIssue = totalIssues.find( curIssue => curIssue.issueName == globalIssue.issueName);
		if (foundIssue) {
		
			finalRes.push({
				issueName: foundIssue.issueName,
				issueCost: foundIssue.issueCost
			})
		}
		else {

			finalRes.push({
				issueName: globalIssue.issueName,
				issueCost: 'null'
			})
		}	
	})

	return finalRes;

}	

module.exports = {
    addCategory,
    listAllCategories,
    addCategoryImage,
    addBrand,
    addModel,
    addBrandImage,
    addModelImage,
	listBrands,
	listModels,
	addModelIssues,
	deleteCategory,
	deleteBrand,
	deleteModel,
	updateBrand,
	updateCategory,
	updateModel,
	addIssueImage,
	listAllIssues,
	updateModelIssue,
	deleteIssue,
	addGlobalIssue,
	listGlobalIssues,
	updateGlobalIssue,
	deleteGlobalIssue,
	getBrandInfo,
	getCatInfo,
	getModelInfo,
	getModelIssueInfo,
	getIssueInfoFromName,
	listAllModelIssuesAdmin
}

/*
lpu id
id proof
details
linkedin
github
*/


/*

in process,completed, rejected

*/