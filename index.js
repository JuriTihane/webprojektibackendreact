const express = require('express')
const bodyParser= require('body-parser')
const cors = require('cors');
const morgan = require("morgan");
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient
const app = express()
const router = express.Router();
const userController = require("./controller/userController");
const port = 3000
const connectionString = "mongodb+srv://root:Asdfghjkl@webprojektibackend.vxnie.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// Start server by running: nodemon

// Mandatory for express
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
// Cors for dev pursposes https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b
app.use(cors())
// Application/json parser
let jsonParser = bodyParser.json()
// Morgan
app.use(morgan("dev"));
//Mongoose
mongoose.set("useCreateIndex", true);
mongoose
    .connect(connectionString, { useNewUrlParser: true })
    .then(() => {
        console.log("Database is connected");
    })
    .catch(err => {
        console.log({ database_error: err });
    });

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

    // Web new post data receiving -> DB
    app.post('/post', jsonParser, async (req, res) => {
        console.log(JSON.stringify(req.body))
        let title = req.body.title;
        console.log(title)
        let found;

        await postsCollection.find({"title":title}).toArray()
            .then(results => {
                for (let i = 0; i < results.length; i++) {
                    if (results[i].title === title) {
                        console.log("Same topic / post found")
                        found = true;
                        res.send("Same topic / post found")
                    } else {
                        found = false;
                    }
                }
            })
            .catch(error => console.error(error))

        if (!found) {
            console.log("Same topic / post NOT found")
            console.log("Pushed to database")
            res.send("Post added successfully")
            await db.collection('posts').insertOne(req.body)
        }
    })

    // Web new comment data receiving -> DB
    app.post('/postComment', jsonParser, async (req, res) => {
        try {
            console.log(JSON.stringify(req.body))
            referenceTitle = req.body.referenceTitle
            let currentDate = new Date().toString()
            json = req.body
            json.date = currentDate
            await postsCollection.findOneAndUpdate({title: referenceTitle}, {$push: {comments: json}}, {returnOriginal: false}, (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                }

                console.log(doc);
            });
            //await db.collection('posts').insertOne(req.body)
        } catch (e) {
            
        }
    })
})

// User routes
const userRoutes = require("./user");
app.use("/user", userRoutes);

router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);
router.get("/me", userController.getUserDetails);

module.exports = router;
