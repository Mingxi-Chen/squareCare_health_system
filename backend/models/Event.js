const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    userid:{
        type:Number,
        require:true
    },
    eventid:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    start:{
        type:Date,
        require:true,
        default: new Date
    },
    end:{
        type:Date,
        require:true,
    },
    allday:{
        type:Boolean,
        require:true
    },
    other_faculties:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model("Event",EventSchema);
