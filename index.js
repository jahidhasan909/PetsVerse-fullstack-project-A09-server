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
    try {
        await client.connect();



        const database = client.db('pets')
        const petscollaction = database.collection('petsinformation')
        const adoptpetscollaction = database.collection('adoptpets')


        app.post('/pets', async (req, res) => {
            const docs = req.body


            const result = await petscollaction.insertOne(docs)
            res.send(result)
        })


        app.get('/allpets', async (req, res) => {
            const cursor = await petscollaction.find().toArray()
            res.send(cursor)
        })

        app.get('/allpets/:id', async (req, res) => {
            const { id } = req.params
            console.log(req.params, 'params');

            const query = {
                _id: new ObjectId(id)
            }
            const result = await petscollaction.findOne(query)
            res.send(result)
        })


        app.post('/adopt', async (req, res) => {
            const docs = req.body

            const result = await adoptpetscollaction.insertOne(docs)
            res.send(result)
        })

        app.patch('/allpets/:id', async (req, res) => {
            const { id } = req.params
            const filter = {
                _id: new ObjectId(id)
            }
            const docs = req.body

            const result = await petscollaction.updateOne(filter, { $set: docs })

            res.send(result)
        })



        app.get('/ownpetslisting/:ownerId', async (req, res) => {
            const { ownerId } = req.params
            const cursor = await petscollaction.find({ ownerId: ownerId }).toArray()
            res.send(cursor)
        })








        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        //   await client.close();
    }
}

run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})