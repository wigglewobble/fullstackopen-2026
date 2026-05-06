const mongoose = require('mongoose')


const password = process.argv[2]

if (!password) {
  console.log('give password as argument')
  process.exit(1)
}


const url = `mongodb+srv://wigglewobble:${password}@cluster0.9dhwk5l.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.log('error connecting to MongoDB:', err.message)
  })


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 3) {
  console.log('phonebook:')

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

// CASE 2: Add new person
if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}