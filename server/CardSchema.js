const mongoose = require('mongoose')

const CardSchema = new mongoose.Schema({
    name : String,
    creator_id: { type: Schema.Types.ObjectId, ref: 'User' },
})