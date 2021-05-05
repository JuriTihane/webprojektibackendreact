const express = require('express')
const bodyParser= require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient
const app = express()
const port = 3000
const connectionString = "mongodb+srv://root:Asdfghjkl@webprojektibackend.vxnie.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// Mandatory for express
app.use(bodyParser.urlencoded({ extended: true }))
// Cors for dev pursposes https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b
app.use(cors())
// Application/json parser
let jsonParser = bodyParser.json()

// First we connect to db and then on REST call we execute requested operations from frond-end
MongoClient.connect(connectionString, {useUnifiedTopology: true}, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')

    const db = client.db('forum')
    const postsCollection = db.collection('posts')

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })

    app.get('/', async (req, res) => {
        await res.send("Hello world!")
    })

    // Web data reading
    app.get('/json', async (req, res) => {
        await db.collection('posts').find().toArray()
            .then(results => {
                res.send(results)
            })
            .catch(error => console.error(error))
    })

    // Web data receiving -> DB
    app.post('/post', jsonParser, async (req, res) => {
        console.log(JSON.stringify(req.body))
        await db.collection('posts').insertOne(req.body)
    })
})