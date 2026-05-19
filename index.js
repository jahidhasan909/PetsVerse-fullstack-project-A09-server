const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000
const cors = require('cors');
require('dotenv').config()

app.use(cors())
app.use(express())





app.get('/', (req, res) => {
    res.send('server is running!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})