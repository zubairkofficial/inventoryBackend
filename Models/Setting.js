const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let settingSchema = new Schema({
    tax:{
        type:Number,
        default: 0,
    },
    
    user_id:{
        type:String,
    }
}, {
    timestamps:true,
    collection: 'settings',
});

module.exports = mongoose.model('Setting', settingSchema);