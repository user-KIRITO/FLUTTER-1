const dbConnector = require("./dbConnector");

const mongoose = dbConnector.mongoose

const metaSchema = mongoose.Schema({

    name: String,
    value: Number
});

const metaData = mongoose.model('metadata', metaSchema);


async function createOrderId() {
    // get current count
    const current = await metaData.find({
        name: 'orderId',
    });
    
    // update the value
    const newMetaData = await metaData.findOneAndUpdate(
        { name:'orderId'},
        { value: current[0].value + 1}
    );

    return newMetaData.value+1;
}

module.exports = {
    createOrderId,
}