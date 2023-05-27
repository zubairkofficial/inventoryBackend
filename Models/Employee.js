const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let employeeSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
    },
    user_id:{
        type:String,
    }
}, {
    timestamps:true,
    collection: 'employees',
});

module.exports = mongoose.model('Employee', employeeSchema);