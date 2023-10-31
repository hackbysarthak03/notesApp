const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }
});

const Notes = mongoose.model('note', NotesSchema);
module.exports = Notes;