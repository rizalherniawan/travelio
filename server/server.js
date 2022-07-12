require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const api = require('./routes/wishlistRoute')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use(api)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is conencted to ${PORT}`)
})
