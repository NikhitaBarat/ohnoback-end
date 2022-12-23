const express = require('express')
const morgan = require('morgan')

//http-error import
const createError = require('http-errors')

require('dotenv').config()
const source = process.env.DATABASE_URL;

const AuthRoute = require('./routes/auth.routes')
const {verifyAccessToken} = require('./helpers/jwt_helper')
const PORT = process.env.PORT || 3000

//connecting to database
const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
mongoose.connect(source)
const db = mongoose.connection
db.once('open', () => {
    console.log('Database is Connected')
})


const app = express()
app.use(morgan('dev'))

app.get('/', verifyAccessToken, async(req, res, next) =>{
    // console.log(req.headers['authorization'])
    res.send("hello")
})

app.use(express.json())
app.use('/auth', AuthRoute)

app.use(async(req, res, next) =>{
    next(createError.NotFound())
    // next(createError.NotFound('this route doesnt exist'))
})

app.use((err, req, res, next) =>{
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        },
    })
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })