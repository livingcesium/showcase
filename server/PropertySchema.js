const mongoose = require('mongoose')

const PropertySchema = new mongoose.Schema({
    name : String,
    type : String
})

module.exports = mongoose.model('Property', PropertySchema)