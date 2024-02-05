require('dotenv').config();
const { ReturnDocument } = require('mongodb');
const auth = require("../auth");

// import the connected mongoose instance from dbConnector js
const dbConnector = require('./dbConnector');
const { UsersManager, TokensManager } = require('auth0');
const { use } = require('chai');


// Then define mongoose as the connected mongoose from dbConnector
const mongoose = dbConnector.mongoose;


// Database Schema Definition for Products
const userSchemaDef = mongoose.Schema({

    employeeRole: String,
    employeeEmail: String,
    employeePhoneNumber: String,
    employeeName: String,
    employeeID: String,
    employeePhotoURL: String,
    hashedPassword: String,
});

const assignmentSchemaDef = mongoose.Schema({

    taskID: String,     // Uniquely identifies the task
    taskName: String,
    assignedEmployeeID: String,
    assignedEmployeeEmail: String,
    taskDescription: String,
    taskStatus: String, // Indicates the current status of the task. Values can be => in-process, rejected, completed, pending
    assignedData: {type: String, required: false},
    dueDate: {type: String, required: false},

    totalCost: Number,
    costBreakDown: [Object],

    orderDate: String,
    reqUserId: String,
    reqUserStreet: String,
    reqUserCity: String,
    reqUserState: String,
    reqUserPhone: String,
    reqUserEmail: String,
    orderId: Number,
    history: [Object],
});

const userSchema = mongoose.model('employees', userSchemaDef); // Creates(if not present) or opens the model in DB

const assignmentSchema = mongoose.model('assignments', assignmentSchemaDef);


async function generateEmployeeID(){

    let currentEmpN = await userSchema.find({});
    currentEmpN = currentEmpN.length;
    currentEmpN = 100001 + currentEmpN + 1;
    genEmpID = currentEmpN.toString();
    return genEmpID;
}


async function createEmployee( { email,name,phone,employeeRole,password } ) {

    // check if user already exist
    
    const userExist = await userSchema.find({employeeEmail: email});
    
    if(userExist.length > 0) {

        return {
            error: 'Employee Already Exists With Same Email',
        }
    }

    else{

        // generate hashpassword
        const hashedPassword = await auth.generateHashedPassword({plainPassword: password});
        const genId = await generateEmployeeID();


        // update the database
        const userRes = await userSchema.create({
            employeeRole: employeeRole,
            employeeEmail: email,
            employeePhoneNumber:phone ,
            employeeName: name,
            employeeID: genId,
            hashedPassword: hashedPassword, 
        });
        console.log(userRes);
        return {
            message:'Employee Created Successfully',
            employeeID: userRes.employeeID,
            employeeRole: userRes.employeeRole,
            employeeName: userRes.employeeName,
        }


    }

}

async function handleLogin({ email, password }) {

    // check if the user exist
    const userExist = await userSchema.find({
        employeeEmail: email,
    });

    if(userExist.length == 0) {

        return 'The Employee With The EmailID Does Not Exist';
    }
    else{

        // chk pasword
        const hashedPassword = userExist[0].hashedPassword;
        const passRes = await auth.comparePassword({ plainPassword:password, hashedPassword: hashedPassword} );
        if(passRes == true ){
            // generate and give the token
            const token = await auth.createToken({
                email: userExist[0].employeeEmail,
                employeeID: userExist[0].employeeID,
                employeeRole: userExist[0].employeeRole,
            });

            console.log(token);
            return {
                accessToken: token,
                employeeRole: userExist[0].employeeRole,
            }
        }
        else if(passRes == false ){

            return 'Wrong Password';
        }
    }
}

async function getEmployeeInfo({ accessToken }) {

    // decode the token
    const tokenRes = await auth.validateAccessToken({accessToken});
    if(tokenRes == 'Invalid Access Token'){
        console.log(tokenRes);
        return tokenRes;
    }
    else {
        const userExist = await userSchema.find({
            employeeEmail: tokenRes.email,
        });
        console.log(userExist);
        return userExist;
    }
}



async function addUserProfilePic( {imageURL, id} ){

    const result = await userSchema.findOneAndUpdate(
        {_id: id},
        {employeePhotoURL: imageURL},
        {new: true}
    );
    return result;
}

async function updateUserProfile({employeeID, newData}){

    const result = await userSchema.findOneAndUpdate(
        {employeeID: employeeID},
        newData,
        { new: true },
    );

    return {
        info: 'User Profile Updated Successfully',
        result
    };
}

async function deleteUser( { employeeID } ){

    try{

        // Fetch the userexist
        const userExist = await userSchema.find({
            employeeID: employeeID
        });

        if(userExist.length == 0) {
            
            console.log('user does not exist');

            return {
                error:'EmployeeID Does Not Exist',
            }
        }

        else{
            // delete the entry from the db
            const deleteRes = await userSchema.deleteOne({
                employeeID: employeeID
            });

            return {
                message:`Employee With EmployeeID ${employeeID} Deleted Successfully`
            };
        }
    }

    catch(err){
        return {
            info: 'Error Deleting User. Try Again.',
            errorMessage: err,
        }
    }

}

async function listAllEmployees(){

    const data = await userSchema.find( {} );
    
    // filter the data
    const finalRes = [];
    data.forEach(element => {
       finalRes.push({
            employeeEmail: element.employeeEmail,
            employeeName: element.employeeName,
            employeeRole: element.employeeRole,
            employeeID: element.employeeID,
            employeePhotoURL: element.employeePhotoURL,
            employeePhoneNumber: element.employeePhoneNumber,
            _id: element._id
       }); 
    });

    return finalRes;
}

async function listAllEmployeeByRole( {employeeRole} ){

    const data = await userSchema.find({
        employeeRole: employeeRole,
    });

    return data;
}


async function createRepairTask( { taskName, taskDescription, reqUserCity, reqUserEmail, reqUserId, reqUserState, reqUserPhone, reqUserStreet, orderId, reqTime, costBreakDown } ) {

    const currentTime = new Date().toISOString();

    const res = await assignmentSchema.create({
        reqUserId: reqUserId,
        reqUserCity: reqUserCity,
        reqUserEmail: reqUserEmail,
        reqUserState: reqUserState,
        reqUserStreet: reqUserStreet,
        reqUserPhone: reqUserPhone,
        
        taskName: taskName,
        taskDescription: taskDescription,
        orderDate: reqTime,
        taskStatus: 'in-process',
        orderId: orderId,
        costBreakDown
    })
    return res;
}

async function viewPendingTasks() {

    const res = assignmentSchema.find({
        taskStatus: 'pending',
    });

    return res;
}


async function todaysTasks({status}) {

    const currentDate = new Date().toISOString();
    const dateOnly = currentDate.split('T')[0];

    let result = [];

    if(status == 'pending') {
        
        const res = await assignmentSchema.find({
            taskStatus:'pending'
        })

        result = res;
    }

    else if(status == 'none'){

        const res = await assignmentSchema.find({
    
        });

        result = res;
    }

    else if(status == 'completed'){

        const res = await assignmentSchema.find({
            taskStatus:'completed',
        });

        result = res;
    }

    const finalRes = [];
    result.forEach(element => {
            
        const resDate = element.orderDate;
        const resDateOnly = JSON.stringify(resDate).split('T')[0].substring(1);
        if(resDateOnly == dateOnly){
            finalRes.push(element);
        }
    });

    return finalRes;

}

async function daysTasks({ dateOfOrder }) {

    const result = await assignmentSchema.find({

    });

    let finalRes = [];
    result.forEach(element => {
        const resDate = element.orderDate;
        const resDateOnly = JSON.stringify(resDate).split('T')[0].substring(1);
        if(resDateOnly == dateOfOrder.substring(1,).substring(0,dateOfOrder.length-2)){
            finalRes.push(element);
        }      
    });

    return finalRes;
}   

async function assignToEmployee({ givenId, employeeID }) {


    async function generateTaskID(){
    
        var currentTasksN = await assignmentSchema.find( {} );
        var currentTasksN = currentTasksN.length.toString();
        const taskID = 't' + currentTasksN.toString().padStart(7, '0');
        return taskID;
    }   
    
    const genTaskID = await generateTaskID();
    console.log(genTaskID);

    // fetch the pending task from db
    const taskRes = await assignmentSchema.findById(givenId);
    
    // change the taskStatus to in-process
    const updatedTask = await assignmentSchema.findByIdAndUpdate(givenId, { taskStatus: 'in-process',assignedEmployeeID: employeeID }, { new: true });
    console.log(updatedTask);
    
    return updateTask;
}


async function viewAllAssignedTasks() {

    const result = await assignmentSchema.find({
        taskStatus: 'in-process',
    });

    return result;
}


async function viewMyTask( {accessToken} ){

    // validate token to get employeeID
    const tokenRes = await auth.validateAccessToken( {accessToken: accessToken} );
    
    // fetch the employee's task
    const taskRes = await assignmentSchema.find({
        assignedEmployeeID: tokenRes.employeeID,
    });
    
    console.log(taskRes);
    return taskRes;

}

async function viewAllTasks(){

    const taskResult = await assignmentSchema.find( {} );
    return taskResult;
}

async function updateTask( {newData, id, staffName} ) {


    // filter the reqData coming in
    // console.log(newData);

    const dbUpdateData = {
        taskStatus: newData.taskStatus,
    }
    

    const result =  await assignmentSchema.findOneAndUpdate(
        {orderId: id},
        dbUpdateData,
        { new: true }
    );

    const dateTime = new Date().toLocaleString();

    await updateOrderHistory({repairId: id, taskStatus: newData.taskStatus, datetime: dateTime, staffName: staffName, comment: newData.comment })

    return {
        info: 'Updated Successfully',
        result
    }

    // call the updatehistory func
    
}

async function viewOrderHistory({ repairId }) {
    const result = await assignmentSchema.find({ orderId: repairId });
    

    return (result[0].history);
}

async function te() {
    const res = await userSchema.find({
        _id:'657bedd77d6bac70488d753b'
    })
    console.log(res);
}

async function viewEndUserOrder( { userID } ) {
    try {
        
        console.log(userID);
        const result = await assignmentSchema.find({
            reqUserId: userID,
        });
        console.log(result);

        if(result.length == 0) {
            return {
                message: 'No Repair Orders Found For This User'
            }
        }
        
        else {
            return result;
        }

    }
    catch(e){
        console.log(e);
        return {
            error:e
        }
    }
}

async function getEndUserOrderById({ userOrderId }) {
    const result = await assignmentSchema.find({
        userOrderId: userOrderId,
    });
    return result;
}

async function getRepairOrderById({ repairId }) {
    const result = await assignmentSchema.find({ orderId: repairId});
    return result;
}

async function updateOrderHistory({ repairId, taskStatus, datetime, staffName, comment }) {

    // fetch the order array from the assignment schema
    const historyRes = await assignmentSchema.find({ orderId: repairId });
    // console.log(historyRes);

    let historyArr = historyRes[0].history;
    
    // push the new history entry
    const newHistory = {
        datetime: datetime,
        comment: comment,
        taskStatus: taskStatus,
        staffName: staffName
    };

    historyArr.push(newHistory);

    const result = await assignmentSchema.findOneAndUpdate({orderId: repairId}, {
        history: historyArr
    }); 

    return result;
}

module.exports = {
    createEmployee,
    listAllEmployees,
    listAllEmployeeByRole,
    getEmployeeInfo,
    assignToEmployee,
    viewMyTask,
    viewAllTasks,
    addUserProfilePic,
    updateTask,
    deleteUser,
    updateUserProfile,
    createRepairTask,
    viewPendingTasks,
    todaysTasks,
    daysTasks,
    handleLogin,
    te,
    viewEndUserOrder,
    viewAllAssignedTasks,
    getEndUserOrderById,
    getRepairOrderById,
    viewOrderHistory,
    updateOrderHistory,
};

/*
/api/module_name/route_name
*/