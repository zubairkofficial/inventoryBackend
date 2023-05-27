const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oilSchema = new Schema({
    name:{
        type:String,
        default: 'No Brand',
    },
    brand:{
        type:String,
        required: true,
    },
    type:{
        type:String,
        required: true,
    },
    quantity:{
        type:Number,
        default:0,
    },
    pricePerQuartz:{
        type:Number,
        required: true,
    },
    pricePerVehicle:{
        type:Number,
        required: true,
    },
    user_id:{
        type:String,
    }
},{
    timestamps:true,
    collection: 'oils',
});

module.exports = mongoose.model('Oil', oilSchema);