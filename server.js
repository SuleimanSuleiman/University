require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const studentRouting = require('./routes/students')
const bookRouting = require('./routes/book')
const universtyRouting = require('./routes/university')


app.set('view engine', 'pug')
app.use(express.json())
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: false
}))
app.use(express.static(path.join(__dirname, '/public')))

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB)
        console.log('connect with mongodb ...')
    } catch (err) {
        throw Error('this is error when the project try with database')
    }
}

mongoose.connection.on('connected', () => {
    console.log(`mongodb connected`)
})

mongoose.connection.on('disconnected', () => {
    console.log(`mongodb disconnected`)
})

app.use('/students', studentRouting)
app.use('/books', bookRouting)
app.use('/university', universtyRouting)


app.listen(process.env.PORT || 9999, () => {
    connect()
    console.log(`Server Running on port => ${process.env.PORT} `)
})