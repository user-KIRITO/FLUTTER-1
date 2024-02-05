const express = require('express');
const userManagementRouter = express.Router();
const bodyParser = require('body-parser');
const auth = require("./auth");
const multer = require('multer');
const repairManagementDb = require('./dbInterfaces/repair_management_db');


const metaData = require('./dbInterfaces/metadata');

const cdn = require('./cdn');

const userManagementDb = require('./dbInterfaces/user_management_db');
const { TokenExpiredError } = require('jsonwebtoken');
const { ConnectionPoolClosedEvent } = require('mongodb');

const upload = multer({ dest: 'image_uploads/' });

userManagementRouter.use(bodyParser.json());


userManagementRouter.get('/listAllEmployees', async (req, res) => {
    //auth.superadminCheck ,
    try {
        // list all employees
        const result = await userManagementDb.listAllEmployees();
        res.json(result);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }

})

userManagementRouter.get('/listEmployeeByRole', async (req, res) => {
    // auth.superadminCheck,

    try {

        const employeeRole = req.query.employeeRole;
        const result = await userManagementDb.listAllEmployeeByRole({
            employeeRole: employeeRole,
        })
        res.json(result);
    }


    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
})


userManagementRouter.get('/getEmployeeInfo', async (req, res) => {

    try {

        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const result = await userManagementDb.getEmployeeInfo({
            accessToken: token,
        });
        if (result == 'Invalid Access Token') {
            res.status(401).json({
                error: 'Unauthorized',
            });
        }
        else {
            res.json(result);
        }
    }
    catch (e) {
        res.status(401).json({
            error: 'Missing or Wrong Access Token',
        });
    }

})


userManagementRouter.post('/createUser', async (req, res) => {

    try {

        const result = await userManagementDb.createEmployee({
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
            employeeRole: req.body.employeeRole,
            password: req.body.password,
        });

        res.json(result);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }

})

userManagementRouter.post('/signInUser', async (req, res) => {

    try {

        const result = await userManagementDb.handleLogin({
            email: req.body.email,
            password: req.body.password,
        });

        if (result == 'The Employee With The EmailID Does Not Exist') {
            res.status(404).json({ error: result });
        }
        else if (result == 'Wrong Password') {
            res.status(401).json({ error: result });
        }
        else {
            res.json(result)
        }
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }

});



// adds or updates the user profile photo
userManagementRouter.post('/uploadUserProfilePhoto', upload.single('image'), async (req, res) => {

    const givenId = req.query.id;
    // Upload the image to CDN and store the result in db
    try {

        const cdnResult = await cdn.uploadImageCdn(req.file.filename);
        const result = userManagementDb.addUserProfilePic({ id: givenId, imageURL: cdnResult.url });
        res.json({
            info: 'Image Added Successfully'
        })
    }

    catch (err) {
        res.json({
            info: 'Error Uploading Image',
            errorMessage: err,
        })
    }

})


userManagementRouter.post('/updateUserProfile', async (req, res) => {

    // auth.superadminCheck,
    try {

        const requestData = req.body;
        const result = await userManagementDb.updateUserProfile({
            employeeID: requestData.employeeID,
            newData: requestData,
        });
        res.json(result);
    }

    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
});

userManagementRouter.post('/assignTask', async (req, res) => {

    //auth.superadminCheck,
    try {

        const givenId = req.query.id;
        const result = await userManagementDb.assignToEmployee({
            givenId: givenId,
            employeeID: req.body.employeeID,
        });

        res.json({
            message: 'Task Assigned Successfully',
        });
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }

})

userManagementRouter.get('/getRepairOrderById', async (req, res) => {

    try {

        const repairId = req.query.id;
        const result = await userManagementDb.getRepairOrderById({ repairId: repairId });
        res.json(result);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
});

userManagementRouter.get('/viewPendingRepairs', async (req, res) => {
    // auth.superadminCheck,
    try {

        const result = await userManagementDb.viewPendingTasks();
        res.json(result);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }

});

userManagementRouter.get('/viewAssignedTasks', async (req, res) => {

    try {

        const result = await userManagementDb.viewAllAssignedTasks();
        res.json(result);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
})

userManagementRouter.post("/createNewRepairRequestHook", async (req, res) => {

    try {

        const { taskName,
            taskDescription,
            reqUserCity,
            reqUserEmail,
            reqUserId,
            reqUserState,
            reqUserPhone,
            userOrderId,
            reqUserStreet,
            reqTime,


            repairNamesList,
            brandId,
            totalCost,
            modelId,
            paymentMethod,
            deliveryMode,
            categoryId,
            repairNames,
        } = req.body;

        console.log(req.body);


        // generate orderId and upate metadata
        const orderId = await metaData.createOrderId();
        console.log(orderId);


        // create custom task description
        const parentCategoryName = await repairManagementDb.getCatInfo({ id: categoryId });
        const parentBrandName = await await repairManagementDb.getBrandInfo({ id: brandId });
        const parentModelName = await repairManagementDb.getModelInfo({ id: modelId });

        const newDesc = `${parentCategoryName} Category, ${parentBrandName} Brand, ${parentModelName} Model, ${repairNames} Repairs. Payment Method: ${paymentMethod}, Delivery Mode: ${deliveryMode}`;

        // parse the cost of each issues and put it into an array

        async function costParser() {

            try {


                let costBreakDown = [];
                // loop through the list \
                const promises = repairNamesList.map(async (issue) => {

                    const issueResults = await repairManagementDb.getIssueInfoFromName({
                        parentBrand: parentBrandName,
                        parentCategory: parentCategoryName,
                        parentModel: parentModelName,
                        issueName: issue
                    });

                    const costObj = {
                        issueName: issueResults[0].issueName,
                        issueCost: issueResults[0].issueCost
                    };

                    costBreakDown.push(costObj);
                })

                await Promise.all(promises);
                return costBreakDown;
            }
            catch (e) {
                console.log(e);
            }
        }
        
        const costBreakDownRes = await costParser();

        const result = await userManagementDb.createRepairTask({
            taskName,
            taskDescription: newDesc,
            reqUserCity,
            reqUserEmail,
            reqUserId,
            reqUserState,
            reqUserPhone,
            reqUserStreet,
            userOrderId,
            orderId,
            reqTime,
            totalCost,
            costBreakDown: costBreakDownRes,
        });

        // update the history also 
        const res0 = await userManagementDb.updateOrderHistory({
            repairId: result.orderId,
            taskStatus: 'in-process', staffName: '', datetime: reqTime
        });

        return res.json(result)

    }

    catch (e) {
        console.log(e);
        res.json({
            error: e
        })
    }
});

userManagementRouter.get('/viewEndUserOrder', async (req, res) => {

    try {
        const userID = req.query.id;
        const result = await userManagementDb.viewEndUserOrder({ userID: userID });

        res.json(result);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
});

userManagementRouter.get('/getEndUserOrderById', async (req, res) => {


    try {

        const userOrderId = req.query.id;
        const result = await userManagementDb.getEndUserOrderById({ userOrderId: userOrderId });
        res.json(result);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
});


// Lists all the tasks assigned to the employee
userManagementRouter.get('/viewMyTasks', async (req, res) => {

    try {

        const token = req.headers.authorization.split(" ")[1];
        const result = await userManagementDb.viewMyTask({ accessToken: token });
        res.json(result);
    }
    catch (e) {
        res.json({ error: e });
    }

})

// Lists all the completed and uncompleted task in the db
userManagementRouter.get('/viewAllTasks', async (req, res) => {

    // auth.superadminCheck,
    try {

        const result = await userManagementDb.viewAllTasks();
        res.json(result);
    }

    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
});

userManagementRouter.post('/updateMyTask', async (req, res) => {

    const givenId = req.query.id;
    const requestData = req.body;
    const result = await userManagementDb.updateTask({ id: givenId, newData: requestData })
    res.json(result);
})


userManagementRouter.get('/viewOrderHistory', async (req, res) => {

    try {

        const repairId = req.query.id;
        console.log(repairId);
        const result = await userManagementDb.viewOrderHistory({ repairId: repairId });
        console.log(result);
        res.json(result);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
});


userManagementRouter.post('/updateTasks', async (req, res) => {

    try {

        const givenId = req.query.id;
        const staffName = req.query.staffName;
        const requestData = req.body;
        const result = await userManagementDb.updateTask({ id: givenId, newData: requestData, staffName: staffName });

        // call the hook to update flutter server if valid change
        if (requestData.taskStatus == 'Canceled' || requestData.taskStatus == 'Complete') {
            // call the fetch to update

            const fetchBody = {
                status: requestData.taskStatus,
            }


            try {
                await fetch(`http://35.154.153.8:4000/hooks/updateOrderHook?id=${givenId}`, {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json'
                    }, body: JSON.stringify(fetchBody)
                })
            }
            catch (e) {
                console.log(e);
            }
        }

        res.json(result);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
})

userManagementRouter.get("/tt", async (req, res) => {

    await userManagementDb.te();
})

userManagementRouter.post('/deleteUser', async (req, res) => {

    // auth.superadminCheck,
    try {
        const employeeID = req.body.employeeID;
        const result = await userManagementDb.deleteUser({ employeeID: employeeID });
        res.json(result);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
});


module.exports = userManagementRouter;