const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oilSchema = new Schema({
    invoice:{
        type: Number,
        required: true,
    },
    customer:{
        type:Object,
        required: true,
    },
    vehicle:{
        type:Object,
        required: true,
    },
    services:{
        type:Array,
        required: true,
    },
    tires:{
        type:Object,
        default:{},
    },
    tiresPrice:{
        type:Number,
        default:0,
    },
    tiresQuantity:{
        type:Number,
        default:0
    },
    oil:{
        type:Object,
        required: true,
    },
    extraOilPrice:{
        type:Number,
        default:0,
    },
    extraOilQuantity:{
        type:Number,
        default:0
    },
    taxInclude:{
        type:String,
        default: false,
    },
    taxType:{
        type:String,
        default: '',
    },
    tax:{
        type:Number,
        default: 0,
    },
    discountInclude:{
        type:String,
        default: false,
    },
    discountType:{
        type:String,
        default: '',
    },
    discount:{
        type:Number,
        default: 0,
    },
    totalPrice:{
        type:Number,
        default:0,
    },
    status:{
        type:String,
        // required: true,
    },
    paymentType:{
        type:String,
        // required: true,
    },
    paid:{
        type:Number,
        default:0,
    },
    remaining:{
        type:Number,
        default:0
    },
    date:{
        type:String,
        required:true,
    },
    created_date:{
        type:String,
        required:true,
    },
    payments:{
        type:Array,
        default:null,
    },
    technician:{
        type:Array,
        required: true,
    },
    tiresTax:{
        type:Number,
        default:0,
    },
    note:{
        type:String,
        // required: true,
    },
    isDraft:{
        type:Number,
        default:0,
    },
    user_id:{
        type:String,
    }
},{
    timestamps:true,
    collection: 'receipts',
});

module.exports = mongoose.model('Receipt', oilSchema);