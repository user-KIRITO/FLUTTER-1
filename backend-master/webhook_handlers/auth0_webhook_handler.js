const express = require('express');
const app = express();
const PORT = 4000;








app.listen(PORT, ()=>{
    console.log(`auth0_webhook_handler listening on ${PORT}`);
} )



