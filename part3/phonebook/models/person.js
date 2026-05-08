require('dotenv').config()
const mongoose= require('mongoose')
const url=process.env.MONGODB_URI
mongoose.set('strictQuery',false)
mongoose.connect(url)
  .then(()=>console.log('connected to MongoDB'))
  .catch(err=>console.log('error connecting: ',err.message))
const phoneValidator=(number)=>{
  const phoneRegex= /^\d{2,3}-\d+$/
  return phoneRegex.test(number)
}
const personSchema=new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: phoneValidator,
      message: props=> `${props.value} is not a valid phone number`,
    },
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports=mongoose.model('Person',personSchema)
