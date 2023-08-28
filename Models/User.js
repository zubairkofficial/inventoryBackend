const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String,
        select:false,
    },
    profile:{
        type:String,
        default:'default.png',
    },
    parent_id:{
        type:String,
        default:0,
    },
    user_role:{
        type:Object,
        default:null,
    },
    user_type:{
        type:Number,
        default:0,
    },
    active:{
        type: Boolean,
        default: true,
    }
}, {
    timestamps:true,
    collection: 'users',
});

module.exports = mongoose.model('User', userSchema);