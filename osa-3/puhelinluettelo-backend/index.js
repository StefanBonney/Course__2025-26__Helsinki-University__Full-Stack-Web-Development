const express = require('express')
const morgan = require('morgan')
const cors = require('cors')  
const app = express()

app.use(express.json())  
app.use(cors())

// create token to log request body
morgan.token('postBody', (request) => {
  return JSON.stringify(request.body)
})
// use custom format with body token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))


let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const date = new Date()
  
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  //console.log('POST REQUEST')
  //console.log('Body:', body)

  // check if name missing
  if (!body.name) {
    //console.log('Error: name missing')
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  // check if number missing
  if (!body.number) {
    //console.log('Error: number missing')
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  // check if name exists
  const nameExists = persons.find(person => person.name === body.name)
  if (nameExists) {
    //console.log('Error: name already exists')
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: String(Math.floor(Math.random() * 100000)),
    name: body.name,
    number: body.number
  }
  
  persons = persons.concat(person)
  
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})