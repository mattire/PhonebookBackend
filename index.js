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

app.get('/api/persons', (request, response) => {
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
    });
  ////response.json(persons)
  //console.log('Persons req');
  // Person.find({}).then(persons => {
  //   console.log('Persons found');
  //   console.log(persons);
  //   response.json(persons)
  // }, (error) => {
  //   response.status(500).json({ error: error.message })
  // })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }, (error) => {
    response.status(500).json({ error: error.message })
  });

  // const id = request.params.id
  // const note = persons.find((note) => note.id === id)

  // if (note) {
  //   response.json(note)
  // } else {
  //   response.status(404).end()
  // }
})

const generateId = () => {
    return Math.round(Math.random()*10000000);
}

app.post('/api/persons', (request, response) => {
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
  }, (error) => {
    response.status(500).json({ error: error.message })
  });

  // Person.findById(id).then(person => {
  //   if (person) {
  //     return response.status(400).json({
  //       error: 'name must be unique',
  //     })
  //     //response.json(person)
  //   } else {
  //     //response.status(404).end()
  //     const person = new Person({
  //       id: generateId(),
  //       name: body.name,
  //       number: body.number,
  //     })
  //     person.save().then(savedPerson => {
  //       console.log("person saved");
        
  //       response.json(savedPerson)
  //     })
  //   }
  // }, (error) => {
  //   response.status(500).json({ error: error.message })
  // });

  // var foundPerson = persons.find(p=>p.name==body.name)
  // if(foundPerson) {
  //   return response.status(400).json({
  //     error: 'name must be unique',
  //   })
  // }
  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   id: generateId().toString(),
  // }
  // persons = persons.concat(person)
  // response.json(person)
})



app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log('delete id', id);
  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  }).catch(error => {
    response.status(500).json({ error: error.message })
  }
  // persons = persons
  //               .filter((note) => note.id !== id)

  // response.status(204).end()
  , (error) => {
    response.status(500).json({ error: error.message })
  }
)});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
