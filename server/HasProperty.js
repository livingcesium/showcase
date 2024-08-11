const mongoose = require('mongoose')




const schema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    value: String,
})

schema.virtual('type').get(function() {
    return this.property.type || null
}) // if property is not populated, this will return null

module.exports = mongoose.model('HasProperty', schema, 'has_property')