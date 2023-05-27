const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let roleSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    user_id:{
        type:String,
    }
}, {
    timestamps:true,
    collection: 'roles',
});

module.exports = mongoose.model('Role', roleSchema);