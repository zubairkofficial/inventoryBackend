const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    company:{
        type:String,
    },
    name:{
        type:String,
        required: true,
    },
    model:{
        type:String,
    },
    customer:{
        type:Object,
        required:true,
    },
    vin_number:{
        type:Object,
    },
    year:{
        type:Object,
    },
    user_id:{
        type:String,
    }
},{
    timestamps:true,
    collection: 'vehicles',
});

module.exports = mongoose.model('Vehicle', vehicleSchema);