const express = require("express");
const analyticsRouter = express.Router();
const bodyParser = require('body-parser');
const userManagementDb = require('./dbInterfaces/user_management_db');


analyticsRouter.get('/t',(req, res) => {

    res.json({
        msg:'hello from analytics'
    });
});

analyticsRouter.get('/todaysTotalAssignments', async (req, res) => {

    try {
        
        if(req.headers.employeeRole == 'superadmin') {
                    
            const result = await userManagementDb.todaysTasks({status:'none'});
            const resCount = result.length;
            res.json({
                count:resCount,
            })
        }
        else{

            res.status(401).json({
                errorMessage: 'Unauthorized',
                info: 'You don\'t have the permissions to access this url'
            });
        }
    }
    catch(e) {
        res.json({error:e});
    }

});

analyticsRouter.get('/todaysPendingAssignments', async (req, res) => {

    try {
        
        if(req.headers.employeeRole == 'superadmin'){

            const result = await userManagementDb.todaysTasks({status:'pending'});
            const resCount = result.length;
            res.json({
                count:resCount,
            })
        }
        else{

            res.status(401).json({
                errorMessage: 'Unauthorized',
                info: 'You don\'t have the permissions to access this url'
            });
        }
    }
    catch(e) {
        res.json({error:e});
    }

});

analyticsRouter.get('/todaysCompletedAssigments', async (req, res) => {

    try {

        if(req.headers.employeeRole == 'superadmin'){

            
            const result = await userManagementDb.todaysTasks({status:'completed'});
            const resCount = result.length;
            res.json({
                count:resCount,
            })
        }
        else{

            res.status(401).json({
                errorMessage: 'Unauthorized',
                info: 'You don\'t have the permissions to access this url'
            });
        }
    }
    catch(e) {
        res.json({error:e});
    }

});

analyticsRouter.get('/daysTotalAssignments', async (req, res) => {

    try {

        if(req.headers.employeeRole == 'superadmin'){

            const reqDate = req.query.date;
            const result = await userManagementDb.daysTasks({dateOfOrder:reqDate});
            const resCount = result.length;
            
            res.json({
                count:resCount,
            });
        }
        else{

            res.status(401).json({
                errorMessage: 'Unauthorized',
                info: 'You don\'t have the permissions to access this url'
            });
        }
    
    }
    catch(e) {
        console.log(e);
        res.json({error:e});
    }
    

});


module.exports = analyticsRouter;