const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const VoteSchema = new Schema({
    name : {
        type : String,
    }
})

module.exports = vote = mongoose.model("votes",VoteSchema);