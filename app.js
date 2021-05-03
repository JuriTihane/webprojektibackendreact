const express = require('express')
const bodyParser= require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient
const app = express()
const port = 3000
const connectionString = "mongodb+srv://root:Asdfghjkl@webprojektibackend.vxnie.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// Mandatory for express
app.use(bodyParser.urlencoded({ extended: true }))
// Cors for dev pursposes
app.use(cors())

// First we connect to db and then on REST call we execute requested operations from frond-end
MongoClient.connect(connectionString, {useUnifiedTopology: true}, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')

    const db = client.db('forum')
    const postsCollection = db.collection('posts')

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })

    app.get('/', (req, res) => {
        res.send("Hello world!")
    })

    app.get('/json', (req, res) => {
        db.collection('posts').find().toArray()
            .then(results => {
                res.send(results)
            })
            .catch(error => console.error(error))
    })
})