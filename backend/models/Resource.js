const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const resourceSchema = new Schema({
    roomType:{
        type: String,
    },
    roomNumber:{
        type: Number,
    },
    roomDepartment:{
        type: String,
    },
    filledStatus:{
        type: String
    },
    date:{
        type: Date
    }

})

module.exports = mongoose.model("Resource", resourceSchema, "resources")