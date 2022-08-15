const mongoose = require('mongoose')
const slug = require('slug')

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'pleace input the Title'],
        unique: true,
        lowercase: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: [true, 'pleace input the price'],
    },
    lengthOfSection: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    section: {
        type: Array,
    },
    slug: {
        type: String,
    },
    studentId:{
        type: mongoose.Types.ObjectId,
        ref: 'Student'
    }
}, {
    timestamps: true
})


BookSchema.pre('save', function (next) {
    this.slug = slug(this.title, '♥')
    next()
})

module.exports = mongoose.model('Book', BookSchema)