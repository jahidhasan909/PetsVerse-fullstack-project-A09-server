const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000
const cors = require('cors');
require('dotenv').config()

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const run = async () => {
    await client.connect();



    const database = client.db('pets')
    const petscollaction = database.collection('petsinformation')


    app.post('/pets', async (req, res) => {
        const docs = req.body


        const result = await petscollaction.insertOne(docs)
        res.send(result)
    })


    app.get('/allpets', async (req, res) => {
        const cursor = await petscollaction.find().toArray()
        res.send(cursor)
    })
   
    app.get('/ownpetslisting/:ownerId', async (req, res) => {
        const { ownerId } = req.params
        const cursor = await petscollaction.find({ ownerId: ownerId }).toArray()
        res.send(cursor)
    })








    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})