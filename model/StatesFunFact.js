const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statesfunfactSchema = new Schema({
    code: {
        type: String,
        require: true
    },
    funfacts: [String]
})

//mongoose will automatically look for the lowercase and plural version of the first parameter below (your model name)
module.exports = mongoose.model('StatesFunFact', statesfunfactSchema);
