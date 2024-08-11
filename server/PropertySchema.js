const mongoose = require('mongoose')

const valid_types = ['text', 'number', 'date', 'boolean', 'tag']

const PropertySchema = new mongoose.Schema({
    name : String,
    type : {
        type: String,
        enum: valid_types
    }
})

module.exports = mongoose.model('Property', PropertySchema)