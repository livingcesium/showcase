const express = require('express')
const User = require('./User')
const Property = require('./PropertySchema')
const HasProperty = require('./HasProperty')
const Card = require('./CardSchema')
const Field = require('./Field')
const InField = require('./InField')
const app = express()
const cors = require('cors')
require('dotenv').config()


const port = process.env.PORT || 9000

const endpoints = {
    get: {
        getUser: async (req, res) => {
            const username = req.query.username
            const password = req.query.password
            try {
                const user = await User.findOne({ username, password })
                res.send(user)
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        },
        getUsers: async (req, res) => {
            try {
                const userList = await User.find({}, {firstname:1, lastname:1});
                console.log(userList)
                res.send(userList)
            }
            catch (error) {
                res.status(500).send(error)
            }
        },
        getProperties: async (req, res) => {
            try {
                const propertyList = await Property.find({});
                console.log(propertyList)
                res.send(propertyList)
            }
            catch (error) {
                res.status(500).send(error)
            }
        },
        "getCardProperties/:cardId": async (req, res) => {
            try {
                const cardProperties = await HasProperty.find({card: req.params.cardId}).populate('property')
                console.log(cardProperties)
                res.send(cardProperties) 
            }
            catch (error) {
                res.status(500).send(error)
            }
        },
        getCards: async (req, res) => {
            try {
                const cardList = await Card.find({})
                console.log(cardList)
                res.send(cardList)
            }
            catch (error) {
                res.status(500).send(error)
            }
        },
        getFields: async (req, res) => {
            try {
                const fieldList = await Field.find({})
                console.log(fieldList)
                res.send(fieldList)
            } catch (error) {
                
            }
        }
    },
    post: {
        createUser: async (req, res) => {
            try {
                console.log(req.body)
                const user = new User(req.body)
                await user.save()
                res.send(user)
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        },

        createProperty: async (req, res) => {
            try {
                console.log(req.body)
                const property = new Property(req.body)
                await property.save()
                res.send(property)
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        },
        assignProperty: async (req, res) => {
            try {
                console.log(req.body)
                const hasProperty = new HasProperty(req.body)
                await hasProperty.save()
                res.send(hasProperty)
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        },
        assignProperties: async (req, res) => {
            try {
                console.log(req.body)
                const { card, assignments } = req.body 
                const hasProperties = assignments.map((property) => new HasProperty({card, ...property}))
                await HasProperty.insertMany(hasProperties)
                res.send(hasProperties)
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        },

        createCard: async (req, res) => {
            try {
                console.log(req.body)
                const card = new Card(req.body)
                await card.save()
                res.send(card)
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        },         

        createField: async (req, res) => {
            try {
                console.log(req.body)
                const field = new Field(req.body)
                await field.save()
                res.send(field)
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        },
        addToField: async (req, res) => {
            try {
                console.log(req.body)
                const inField = new InField(req.body)
                await inField.save()
                res.send(inField)
            } catch (error) {
                console.log(error)
                res.status(500).send(error)
            }
        },
        removeFromField: async (req, res) => {
            try {
                console.log(req.body)
                const result = await InField.deleteOne(req.body)
                if (result.deletedCount === 0) {
                    res.status(404).send({ message: "Document not found." })
                } else {
                    res.send({ message: "Document removed successfully." })
                }
            } catch (error) {
                console.log(error)
                res(500).send(error)
            }
        }
    },
    delete: {
        'cards/:_id': async (req, res) => {
            try {
                const { _id } = req.params
                const result = await Card.deleteOne({ _id })
                await HasProperty.deleteMany({ card: _id })
                await InField.deleteMany({ card: _id })

                if (result.deletedCount === 0) {
                    // No document was deleted, likely because it wasn't found
                    return res.status(404).json({ message: 'Card not found' })
                }
                res.json({ message: 'Card deleted successfully' })
            } catch (error) {
                console.error(error)
                res.status(500).json({ message: 'An error occurred while deleting the card' })
            }
        },
        'has_property/:_id': async (req, res) => {
            try {
                const { _id } = req.params
                const result = await HasProperty.deleteOne({ _id })
            } catch (error) {
                console.error(error)
                res.status(500).json({ message: 'An error occurred while deleting the property' })
            }
        },
        'fields/:_id': async (req, res) => {
            try {
                const { _id } = req.params
                const result = await Field.deleteOne({ _id })
                await InField.deleteMany({ field: _id })
            } catch (error) {
                console.error(error)
                res.status(500).json({ message: 'An error occurred while deleting the field' })
            }
        },
        'in_field/:_id': async (req, res) => {
            try {
                const { _id } = req.params
                const result = await InField.deleteOne({ _id })
            } catch (error) {
                console.error(error)
                res.status(500).json({ message: 'An error occurred while deleting the field' })
            }  
        }
    }
    
}


const start = () => {
    app.use(express.json())
    app.use(cors())
    app.listen(port, () => {
        console.log(`Server started on port ${port}`)
    })
}

const connectDatabase = () => {
    const mongoose = require('mongoose')
    mongoose.connect(process.env.MONGO_URI)
    const database = mongoose.connection

    database.on('error', (error) => console.log(error))
    database.once('connected'
        , () => console.log('Database Connected'))
}

const createEndpoints = () => {
    for (const method in endpoints) {
        for (const endpoint in endpoints[method]) {
            // app[ get/post ]() == app.get()/post()
            app[method](`/${endpoint}`, endpoints[method][endpoint])
        }
    }
}

// const createEndpoints = () => {
//     app.post('/createUser', async (req, res) => {
//         try {
//             console.log(req.body)
//             const user = new User(req.body)
//             await user.save()
//             res.send(user)
//         } catch (error) {
//             console.log(error)
//             res.status(500).send(error)
//         }
//     })
//     app.get('/getUser', async (req, res) => {
//         const username = req.query.username
//         const password = req.query.password
//         try {
//             const user = await User.findOne({ username, password })
//             res.send(user)
//         } catch (error) {
//             console.log(error)
//             res.status(500).send(error)
//         }
//     })
// }

start()
connectDatabase()
createEndpoints()