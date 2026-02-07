const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to MongoDB')

mongoose.connect(url, { family: 4 })
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        const parts = value.split('-')

        // 2 parts (one hyphen)
        if (parts.length !== 2) return false

        const firstPart = parts[0]
        const secondPart = parts[1]

        // Check first: 2 or 3 digits
        const firstPartCheck = /^\d{2,3}$/.test(firstPart)
        console.log('First part:', firstPart, '→', firstPartCheck)

        // Check second part: digits only
        const secondPartCheck = /^\d+$/.test(secondPart)
        console.log('Second part:', secondPart, '→', secondPartCheck)

        // total length
        const lengthCheck = value.length >= 8
        console.log('Length:', value.length, '→', lengthCheck)

        return firstPartCheck && secondPartCheck && lengthCheck
      },
      message: 'Invalid phone number format (e.g. 040-1234556)'
    }
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
