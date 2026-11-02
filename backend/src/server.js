const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express();
const cors = require('cors')

const routes = require('./routes/index.js')

app.use(cors({
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
}))

app.use(express.json())

//http://localhost:3000//api/v1
app.use('/api/v1', routes)

app.listen(3000, () => {
    console.log('server run on port 3000')
})
