const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express()
const port = 3000
const { PASSWORD } = require('./secure')
const uri = `mongodb+srv://express:${PASSWORD}@cluster0.1wfsywh.mongodb.net/?retryWrites=true&w=majority`

app.use("/img", express.static('img'))
app.set('view engine', 'ejs')
app.set('views', './views')

app.use(bodyParser.urlencoded({ extended: false }));


const client = new MongoClient(uri, { useNewUrlParser: true });


client.connect(err => {
    const collection = client.db("shitpost").collection("posts");


    app.get('/', (req, res) => {
        var posts = {};
        const query = {}
        const sort = { _id: -1 };
        collection.find(query, { projection: { content: 1 } }).sort(sort).toArray((err, posts) => {
            posts = posts;
            res.render('home', { posts: posts });
        });
    })

    app.post('/', (req, res) => {
        const content = req.body.content;
        console.log(content);

        // Insert the data into the database
        const doc = { content: content };
        collection.insertOne(doc, (err, result) => {
            console.log('Inserted')
            res.redirect('/');
        });
    })

    app.listen(port, () => {
        console.log(`Listening port : ${port}`);
    })
})