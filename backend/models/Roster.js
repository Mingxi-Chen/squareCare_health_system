const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RosterSchema = new Schema({
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
    startTime:{
        type:String,
        require:true,
        default: new Date
    },
    endTime:{
        type:String,
        require:true,
    },
    allday:{
        type:Boolean,
        require:true
    },
    daysOfWeek:[{
        type:Number
    }]
})

module.exports = mongoose.model("Roster", RosterSchema)
