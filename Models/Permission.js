const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let permissionSchema = new Schema({
    role_id:{
        type:String,
        required: true,
    },
    tab_link:{
        type:String,
        required: true,

    },
    can_create:{
        type:String,
        default:0,
    },
    can_update:{
        type:String,
        default:0,
    },
    can_delete:{
        type:String,
        default:0,
    },
    
}, {
    timestamps:true,
    collection: 'permissions',
});

module.exports = mongoose.model('Permission', permissionSchema);