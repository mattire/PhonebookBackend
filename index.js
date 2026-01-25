require('dotenv').config()
const express = require('express')
//const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')


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

//app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
//app.use(morgan('tiny'))
app.use(morgan(function (tokens, req, res) {
  console.log(req.body);
  
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (request, response) => {
  response.send(
    `<p1>Phonbook has info for ${persons.length} people</p1><br/><br/>
     <p1>${Date()}</p1>`
  )
})

app.get('/api/persons', (request, response, next) => {
  console.log('alfkjalkfj');
  
  Person.find({}).then((res)=>{
        console.log('phonebook');
        console.log(res);
        res.forEach(p=>{
            //console.log(p);
            console.log(`${p.name} ${p.number}`);
        });
        response.json(res);
        //mongoose.connection.close();
    }).catch;
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error));
  // , (error) => {
  //   response.status(500).json({ error: error.message })
  // }).catch(error => next(error));
})

const generateId = () => {
    return Math.round(Math.random()*10000000);
}

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  //console.log("********************");
  //console.log(body)
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    })
  }
  console.log("name and num ok");
  
  Person.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique',
      })
    } else {
      const person = new Person({
        name: body.name,  
        number: body.number,
      })
      person.save().then(savedPerson => {
        console.log("person saved");
        response.json(savedPerson)
      })
    }
  }).catch(error => next(error));
})



app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  console.log('delete id', id);
  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  }).next(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else {
    return response.status(500).json({ error: error.message })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
