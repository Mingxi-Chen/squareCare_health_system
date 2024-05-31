const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Kyle
 * Each Personal have a list Chat ID. Each Chat contain a list of message. Each message have properties of sentBy, sentTo, time and content.
 */

const message = new Schema({
    sentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
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

const ChatSchema = new Schema({
    message:[message]
})

module.exports = mongoose.model("Chat",ChatSchema);