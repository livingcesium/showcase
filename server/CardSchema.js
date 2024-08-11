const mongoose = require('mongoose')

const CardSchema = new mongoose.Schema({
    name : String,
    creator_id: { type: mongoose.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('Card', CardSchema)