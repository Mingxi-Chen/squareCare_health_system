const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const task = new Schema({
    id:{
        type: Number,
        require:true
    },
    content:{
        type: String,
        require:true,
        default:''
    }
})

const user = new Schema({
    id:{
        type:Number,
        require:true
    },
    name: {
        type: String,
        require:true
    },
    email: {
        type: String,
        require:true
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        require:true
    },
    department:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    gender:{
        type:String,
        require:true
    },
    phonenum:{
        type:String,
        require:true
    },
    tempPassword:{
        type:String
    },
    Chatlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    }],
    Event:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    }],
    Roster:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Roster"
    }],
    task:{
        type: [String], // or specify your desired type
        validate: {
          validator: function(v) {
            return v.length === 5;
          },
          message: props => `${props.value} must contain exactly 5 elements!`
        }
      }
})
module.exports = mongoose.model("User", user, "users")
