const mongoose = require('mongoose')
const type_map = require('./TypeMap')


class HasPropertyFactory {

    constructor() {
        this.type_map = type_map
    }

    createSchema(type){
        let name
        type = type.toLowerCase()  
        if(this.type_map[type] === undefined)
            throw new Error("Invalid type")

        name = "Has" + type.charAt(0).toUpperCase() + type.slice(1) // Capitalize first letter e.g. HasText
        const relation = new mongoose.Schema({
            property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
            card_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
            value: this.type_map[type]
        })
        return mongoose.model(name, relation)
    }
}

module.exports = HasPropertyFactory