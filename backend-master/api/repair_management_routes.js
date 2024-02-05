const express = require('express');
const repairManagementRouter = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');

const cdn = require('./cdn');

const upload = multer({ dest: 'image_uploads/' });

const repairManagementDb = require('./dbInterfaces/repair_management_db');

repairManagementRouter.use(bodyParser.json());


repairManagementRouter.post('/addCategory', async (req, res) => {
    
    const requestData = req.body;
    const result = await repairManagementDb.addCategory( {categoryName: requestData.categoryName} );
    res.json({
        message: 'Category added successfully',
        result: result
    });
})

repairManagementRouter.post('/updateCategory', async (req, res) => {

    try{
        const givenId = req.query.id;
        const categoryName = req.body.categoryName;
        const result = await repairManagementDb.updateCategory({
            givenId: givenId,
            categoryName: categoryName,
        });
        console.log(result);
        res.json({
            message:'Updated Successfully',
        })
    }
    catch(e){
        res.json({error:e});
    }
});

repairManagementRouter.post('/updateBrand', async (req, res) => {

    try{
        const givenId = req.query.id;
        const brandName = req.body.brandName;
        const result = await repairManagementDb.updateBrand({
            givenId: givenId,
            brandName: brandName,
        })
        console.log(result);
        res.json({
            message:'Updated Successfully',
        })
    }
    catch(e){
        res.json({error:e});
    }
});

repairManagementRouter.post('/updateModel', async (req, res) => {

    try{
        const givenId = req.query.id;
        const modelName = req.body.modelName;
        const result = await repairManagementDb.updateModel({
            givenId:givenId,
            modelName: modelName,
        });
        console.log(result);
        res.json({
            message:'Updated Successfully',
        })
    }
    catch(e){
        res.json({error:e});
    }
})

repairManagementRouter.post('/updateModelIssue', async (req, res) => {

    try {

        const givenId = req.query.id;
        const reqBody = req.body;
        const result = await repairManagementDb.updateModelIssue({ issueId: givenId, reqBody: reqBody } );
        res.json(result);
    }
    catch(e) {
        console.log(e);
        res.json({error: e});
    }
})

repairManagementRouter.get('/listCategories', (req, res) => {

    repairManagementDb.listAllCategories()
    .then( (data) => {
        res.json(data);
    } )
})


repairManagementRouter.delete('/deleteCategory', async (req, res) => {

    try {

        const givenId = req.query.id;
        const result = await repairManagementDb.deleteCategory({
            givenId: givenId,
        });
        
        res.json(result);
    }

    catch(err){

        res.json({
            info: 'Error In Deleting',
            errorMessage: err,
        })
    }
});


repairManagementRouter.delete('/deleteBrand', async (req, res) => {

    try {

        const givenId = req.query.id;
        const result = await repairManagementDb.deleteBrand( {givenId: givenId })
        res.json(result);
    }
    
    catch(err) {
        console.log(err);
        res.json({
            info:'Error In Deleting',
            errorMessage: err,
        })
    }
    
});

repairManagementRouter.delete('/deleteModel', async (req, res) => {

    try {
        const givenId = req.query.id;
        const result = repairManagementDb.deleteModel({ modelId: givenId });
        res.json(result);
    }

    catch(err) {
        console.log(err);
        res.json({
            info: 'Error In Deleting',
            errorMessage: err,
        })
    }
});

repairManagementRouter.delete('/deleteIssue', async (req, res) => {

    try {

        const givenId =  req.query.id;
        const result = await repairManagementDb.deleteIssue( {
            issueId: givenId,
        });
        
        res.json(result);
    }
    catch(e) {
        console.log(e);
        res.json({ error:e });
    }
});
 
repairManagementRouter.get('/listBrands', async (req, res) => {
        
    try {

        const givenId = req.query.id;
        const result = await repairManagementDb.listBrands({catId: givenId});
        res.json(result);
    }
    catch(e){
        console.log(e);
        res.json({error:e});
    }
    
})

repairManagementRouter.get('/listModels', async (req, res) => {

    try {
        
        const givenId = req.query.id;
        const result = await repairManagementDb.listModels({brandId: givenId});
        res.json(result);
    }
    catch(e){
        res.json({error:e});
    }
})

repairManagementRouter.get('/listIssues', async (req, res) => {

    try {

        const givenId = req.query.id;
        const result = await repairManagementDb.listAllIssues({modelId:givenId});
        res.json(result);
    }
    catch(e){
        res.json({error:e});
    }
})

repairManagementRouter.get('/listAllModelIssues', async (req, res) => {

    try {
        const modelId = req.query.id;
        const result  = await repairManagementDb.listAllModelIssuesAdmin({ modelId: modelId });
        res.json(result);
    }
    catch(e) {
        console.log(e);
        res.status(500).json(e);
    }
});


repairManagementRouter.post('/uploadCategoryImage',upload.single('image'), async (req, res) => {

    const givenId =  req.query.id;
        try{

            const cdnResult = await cdn.uploadImageCdn(req.file.filename);
            const result =  repairManagementDb.addCategoryImage({ id: givenId, imageURL: cdnResult.url});
            res.json({
                info: 'Image Added Successfully'
            })
        }

        catch(err){
            console.log(err);
            res.json({
                info: 'Error Uploading Image',
                errorMessage: err,
            })
        } 
})

repairManagementRouter.post('/addBrand', async (req, res) => {

   try {

        const givenId = req.query.id;
        const brandName = req.body.brandName; 
        const result = await repairManagementDb.addBrand({
            catId: givenId,
            brandName: brandName,
        });
        res.json(result);   
   }
   catch(e) {
        console.log(e);
        res.json({error:e});
   }
})

repairManagementRouter.post('/uploadBrandImage',upload.single('image'), async (req, res) => {

    const givenId =  req.query.id;
        try{

            const cdnResult = await cdn.uploadImageCdn(req.file.filename);
            const result =  repairManagementDb.addBrandImage({ id: givenId, imageURL: cdnResult.url});
            res.json({
                info: 'Image Added Successfully'
            })
        }
        catch(err){
            res.json({
                info: 'Error Uploading Image',
                errorMessage: err,
            })
        }
})

repairManagementRouter.post('/addModel', async (req, res) => {

    try {
        
        const givenId = req.query.id;
        const modelName = req.body.modelName;
        const result = await repairManagementDb.addModel({
            brandId: givenId,
            modelName: modelName,
        });
        res.json(result);
    }   
    catch(e) {
        console.log(e);
        res.json({error:e});
    }

   
})


repairManagementRouter.post('/uploadModelImage',upload.single('image'), async (req, res) => {

    const givenId =  req.query.id;

    try{
        const cdnResult = await cdn.uploadImageCdn(req.file.filename);
        const result =  repairManagementDb.addModelImage({ id: givenId, imageURL: cdnResult.url});
        res.json({
            info: 'Image Added Successfully'
        })
    }
    catch(err){
        res.json({
            info: 'Error Uploading Image',
            errorMessage: err,
        })
    }
})

repairManagementRouter.post('/addModelIssues', async (req, res) => {

    try {
        const modelId = req.query.modelId;
        const issueId = req.query.issueId;
        const issueCost = req.body.issueCost;
        const result = await repairManagementDb.addModelIssues({ modelId: modelId, issueId: issueId, issueCost: issueCost });
        res.json(result);
    }
    catch(e) {
        console.log(e);
        res.json({ error: e});
    }
})

repairManagementRouter.post('/uploadIssueImage',upload.single('image'), async (req, res) => {

    const givenId =  req.query.id;

    try{
        const cdnResult = await cdn.uploadImageCdn(req.file.filename);
        const result = await repairManagementDb.addIssueImage({imageURL: cdnResult.url, id: givenId });

        res.json({
            info: 'Image Added Successfully'
        })
    }
    catch(err){
        res.json({
            info: 'Error Uploading Image',
            errorMessage: err,
        })
    }
})


repairManagementRouter.get('/listGlobalIssues', async (req, res) => {

    try {
        const result = await repairManagementDb.listGlobalIssues();
        res.json(result);
    }
    catch(e) {
        console.log(e);
        res.json({error:e});
    }
});

repairManagementRouter.post('/addGlobalIssue', async (req, res) => {

    try {
        
        const issueName = req.body.issueName;
        const issueDescription = req.body.issueDescription;
        const result = await repairManagementDb.addGlobalIssue({
            issueDescription: issueDescription,
            issueName: issueName,
        });

        res.json(result);
    }
    catch(e) {

    }
});

repairManagementRouter.delete('/deleteGlobalIssue', async (req, res) => {

    try {

        const issueId = req.query.id;
        const result = await repairManagementDb.deleteGlobalIssue({ issueId: issueId });
        res.json(result);
    }
    catch(e) {

        console.log(e);
        res.json({ error: e});
    }
});

repairManagementRouter.post('/updateGlobalIssue', async (req, res) => {

    try {

        const issueId = req.query.id;
        const reqBody = req.body;
        const result = await repairManagementDb.updateGlobalIssue({issueId: issueId, reqBody: reqBody});
        res.json(result);
    }   
    catch(e) {
        console.log(e);
        res.json({ error: e});
    }
})


module.exports = repairManagementRouter;