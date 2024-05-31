const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
    sentTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    time:{
        type:Date,
        default: Date.now(),
        require:true
    },
    content:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model("Notification",Notification);