const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tireSchema = new Schema({
    brand:{
        type:String,
        default: 'No Brand',
    },
    size:{
        type:String,
        required: true,
    },
    quantity:{
        type:Number,
        default:0,
    },
    quality:{
        type:String,
        required: true,
    },
    price:{
        type:String,
        required: true,
    },
    user_id:{
        type:String,
    }
},{
    timestamps:true,
    collection: 'tires',
});

module.exports = mongoose.model('Tire', tireSchema);