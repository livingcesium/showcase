const mongoose = require('mongoose')

const CardRelation = new mongoose.Schema({
    extends_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    card_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' }
})

module.exports = mongoose.model('CardRelation', CardRelation)