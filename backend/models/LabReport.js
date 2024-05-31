const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabReport = new Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Patient",
        require:true
    },
    filename:{
        type:String,
        require:true
    },
    uploadDate:{
        type:Date,
        default: Date.now(),
    },
    path:{
        type:String,
        require:true
    }
})


module.exports = mongoose.model("Report",LabReport);