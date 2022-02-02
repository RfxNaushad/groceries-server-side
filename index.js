const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId  = require('mongodb').ObjectID;
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5500;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to BD Groceries Shop Backend')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwouc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bdGroceries = client.db("bd-groceries").collection("groceries");
  const orders = client.db("bd-groceries").collection("orders");
  console.log("Data base connected");
  
// data post to dbs

app.get("/showdata", (req,res)=>{
  bdGroceries.find()
  .toArray((err, items)=>{
    res.send(items)
  })
})

app.post("/productupload",(req,res)=>{

  const newProduct = req.body;
  bdGroceries.insertOne(newProduct)
  .then(result => {
    res.send(result.insertedCount > 0)
    res.redirect("/")
  })

})

app.post("/addorder",(req,res)=>{

  const order = req.body;
  orders.insertOne(order)
  .then(result => {
    res.send(result.insertedCount > 0)
  })

})

app.get("/showorders", (req,res)=>{
  orders.find()
  .toArray((err, items)=>{
    res.send(items)
  })
})

app.delete('/delete/:id',(req,res) =>{

  bdGroceries.deleteOne({_id: ObjectId(req.params.id)})
  .then(result => {
    console.log(result);
    
  })
})


  // client.close();
});


app.listen(process.env.PORT || port)