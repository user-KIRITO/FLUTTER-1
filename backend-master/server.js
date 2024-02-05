const express = require("express");
const app = express();
const PORT = 3001;
const cors = require("cors");
const bodyParser = require("body-parser");
const productManagementRouter = require('./api/product_management_routes');
const userManagementRouter = require('./api/user_management_routes');
const repairManagementRouter = require('./api/repair_management_routes');
const endUserRouter = require("./api/end_user_management_routes");
const analyticsRouter = require("./api/analytics_system_routes");
const offerRouter = require("./api/offer_management_routes");
require('dotenv').config();

app.use(express.static('public'));
app.use(cors());

app.use('/api/products', productManagementRouter);
app.use('/api/repairs', repairManagementRouter);
app.use('/api/users', userManagementRouter);
app.use('/api/endUsers', endUserRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/offers', offerRouter);



app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});

module.exports = app;