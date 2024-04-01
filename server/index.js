const express = require('express')
const User = require('./User')
const Property = require('./PropertySchema')
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
    database.once('connected', () => console.log('Database Connected'))
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