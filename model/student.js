const mongoose = require('mongoose')
const {
    isEmail
} = require('validator')

const studentChema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'pleace input the First name']
    },
    lastName: {
        type: String,
        required: [true, 'pleace input the family name']
    },
    email: {
        type: String,
        required: [true, 'pleace input the email'],
        validate: [isEmail, 'pleace input currect email'],
        unique: true,
        lowercase: true
    },
    phone: {
        type: Array,
        max: 2,
    },
    age: {
        type: Number
    },
    books: [
        {
            book:{
                type: mongoose.Types.ObjectId,
                ref: 'Book'
            }
        }
    ],
    universityId:{
        type: mongoose.Types.ObjectId,
        ref: 'University'
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('Student', studentChema)