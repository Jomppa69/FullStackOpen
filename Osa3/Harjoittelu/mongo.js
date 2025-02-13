const mongoose = require('mongoose')



if (process.argv.length <3) {
  console.log('Give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const url =`mongodb+srv://joonakivela:${password}@fullstackopen.ijofj.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })

} else {

  Person.find({}).then(result => {
    console.log("Phonebook:");
    result.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close()
  })
}





