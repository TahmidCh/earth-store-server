const express = require('express')
const app = express()
const port = process.env.PORT || 5000

require('dotenv').config()


const ObjectID = require('mongodb').ObjectID;
// const admin = require('firebase-admin');

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbsgn.mongodb.net/freshvalley?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const elementCollection = client.db("freshvalley").collection("products");
  const customersCollection = client.db("freshvalley").collection("customers");
  
  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    customersCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
    console.log(newOrder);
  })

  app.get('/orders', (req, res) =>{
    console.log(req.headers.authorization);
    customersCollection.find({email: req.query.email})
    .toArray( (err, documents) =>{
      res.send(documents);
    })
  })

  app.get('/products', (req, res) =>{
    elementCollection.find()
    .toArray( (err, items) =>{
      res.send(items);
    })
  })

  app.post('/addProducts', (req, res) => {
    const newelement = req.body;
    elementCollection.insertOne(newelement)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

  app.delete('/deleteProduct/:id', (req, res) =>{
    const id = ObjectID(req.params.id);
    elementCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(documents.deleteCount > 0))
  })

});


app.get('/', (req, res) => {
  res.send('Hello Earth C3PO!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})