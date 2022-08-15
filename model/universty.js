const mongoose = require('mongoose')
const slug = require('slug')


const univerSitySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'pleace input the name']
    },
    slug: {
        type: String,
    },
    location: {
        type: String
    },
    students: [{
        student: {
            type: mongoose.Types.ObjectId,
            ref: 'Student'
        }
    }]

}, {
    timestamps: true
})

univerSitySchema.pre('save', async function (next) {
    this.slug = slug(this.name, '♥')
    next()
})

module.exports = mongoose.model('University', univerSitySchema)