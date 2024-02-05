const express = require('express');
const endUserRouter = express.Router();
const userManagementDb = require("./dbInterfaces/user_management_db");


endUserRouter.get('/t', (req, res) => {

    res.json({
        message: 'Hello from enduser management'
    })
});

endUserRouter.get('/viewAllUsers', async (req, res) => {
    
    try{
        
            const resp = await fetch('http://127.0.0.1:8072/endUser/viewAllUsers',{method: 'GET', headers:{
                'x-access-key':'',
            }});
            const respJson = await resp.json();
            res.json(respJson);
    }
    catch(e){
        res.json({error: e});
        console.log(e);
    }

});

module.exports = endUserRouter;