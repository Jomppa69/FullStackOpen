const mongoose = require('mongoose')


function validator(val) {
    if (val.length < 8) {
        console.log('number too short')
        return false
    }
    let fields = val.split('-')
    if (fields[0].length < 2 || fields[0].length > 3) {
        console.log('no 2 or 3 numbers before \'-\'', fields[0].length)
        return false
    }
    return !isNaN(fields[0]) && !isNaN(fields[1])
}


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: validator
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)