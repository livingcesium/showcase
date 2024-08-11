const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field' },
    timestamp: { type: Date, default: Date.now },
})

module.exports = mongoose.model('InField', schema, 'in_field')