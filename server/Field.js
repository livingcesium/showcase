const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Field', schema)