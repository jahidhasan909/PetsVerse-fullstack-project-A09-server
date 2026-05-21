const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000
const cors = require('cors');
require('dotenv').config()
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');

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







const jWKS = createRemoteJWKSet(new URL(process.env.JWKSUSER_URI))

const vrifyToken = async (req, res, next) => {

    const authHader = req?.headers.authorization
    if (!authHader) {
        return res.status(401).json({ meassage: 'unauthorizte' })
    }
    const token = authHader.split(" ")[1]
    if (!token) {
        return res.status(403).json({ meassage: 'unauthorizte' })
    }


    try {
        const { payload } = await jwtVerify(token, jWKS)
        console.log(payload);

        next()
    } catch (e) {
        return res.status(401).json({ meassage: 'Forbiden' })
    }

}






const run = async () => {
    try {
        // await client.connect();



        const database = client.db('pets')
        const petscollaction = database.collection('petsinformation')
        const adoptpetscollaction = database.collection('adoptpets')


        app.post('/pets', async (req, res) => {
            const docs = req.body


            const result = await petscollaction.insertOne(docs)
            res.send(result)
        })


        app.get('/allpets', async (req, res) => {


            const search = req.query.search
            const species = req.query.species

            let query = {};


            if (search) {
                query.petName = {
                    $regex: search,
                    $options: 'i'
                }
            }


            if (species) {
                query.species = {
                    $in: [species]
                }
            }


            const cursor = await petscollaction.find(query).toArray()
            res.send(cursor)







        })

        app.get('/allpets/:id', vrifyToken, async (req, res) => {
            const { id } = req.params
            // console.log(req.params, 'params');

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


        app.get('/adopt',vrifyToken, async (req, res) => {
            const email = req.query.email
            const query = {
                userEmail: email
            }
            const cursor = await adoptpetscollaction.find(query).toArray()
            res.send(cursor)
        })


        app.patch('/allpets/:id',vrifyToken, async (req, res) => {
            const { id } = req.params
            const filter = {
                _id: new ObjectId(id)
            }
            const docs = req.body

            const result = await petscollaction.updateOne(filter, { $set: docs })

            res.send(result)
        })



        app.get('/ownpetslisting/:ownerId', vrifyToken, async (req, res) => {
            const { ownerId } = req.params
            const cursor = await petscollaction.find({ ownerId: ownerId }).toArray()
            res.send(cursor)
        })



        app.get('/adopt/:petsId', vrifyToken, async (req, res) => {
            const { petsId } = req.params;

            const query = { petsId };

            const result = await adoptpetscollaction.find(query).toArray();
            res.send(result);
        });



        app.patch('/adopt/:id', async (req, res) => {

            try {

                const { id } = req.params;

                const { status, petsId } = req.body;

                // console.log(id);
                // console.log(status);
                // console.log(petsId);


                const filter = {
                    _id: new ObjectId(id)
                };

                const updateDoc = {
                    $set: {
                        status: status
                    }
                };

                const result = await adoptpetscollaction.updateOne(
                    filter,
                    updateDoc
                );


                if (status === "approved") {

                    await petscollaction.updateOne(
                        {
                            _id: new ObjectId(petsId)
                        },
                        {
                            $set: {
                                status: "adopted"
                            }
                        }
                    );
                }

                res.send(result);

            } catch (error) {

                console.log(error);

                res.status(500).send({
                    message: "server error"
                });
            }
        });




        app.delete('/adopt/:petsId',vrifyToken, async (req, res) => {
            const { petsId } = req.params
            const filter = {
                _id: new ObjectId(petsId)
            }
            const result = await adoptpetscollaction.deleteOne(filter)
            res.send(result)
        })

        app.delete('/ownpetslisting/:id',vrifyToken, async (req, res) => {
            const { id } = req.params
            const filter = {
                _id: new ObjectId(id)
            }
            const result = await petscollaction.deleteOne(filter)
            res.send(result)
        })





        app.patch('/ownpetslisting/:id',vrifyToken, async (req, res) => {
            const id = req.params.id
            const filter = {
                _id: new ObjectId(id)
            }
            const docs = req.body

            const result = await petscollaction.updateOne(filter, { $set: docs })

            res.send(result)
        })






        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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