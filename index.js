const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan('tiny'))

morgan.token('body', (req, res) => JSON.stringify(req.body))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  const personsLength = persons.length
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${personsLength} people</p>
    <p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()

})

const generateId = (max) => {
  return Math.floor(Math.random() * max)
}


app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number is missing'
    })
  }


  const duplicateName = persons.find((item) => item.name === body.name)

  if (duplicateName) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(1000),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})