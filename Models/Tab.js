const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let tabSchema = new Schema({
    tab_name:{
        type:String,
        required: true,
    },
    tab_icon:{
        type:String,
    },
    tab_link:{
        type:String,
    },
    is_child:{
        type:String,
        default:0,
    },
    parent_id:{
        type:String,
        default:0,
    },
}, {
    timestamps:true,
    collection: 'tabs',
});

module.exports = mongoose.model('Tab', tabSchema);