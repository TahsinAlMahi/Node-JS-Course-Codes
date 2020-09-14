const express = require('express')
const hbs = require('hbs')

const app = express()

const publicDirectory = path.join(__dirname, 'public')
const viewsPath = path.join(__dirname, '/public/templates/views')
const partialsPath = path.join(__dirname, '/public/templates/partials')

app.use(express.static(publicDirectory))
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.get('/', function(req, res) {
  res.send(info)
})

app.get('/about', function(req, res) {
  res.render('about.hbs')
})

app.get('*', function(req, res) {
  res.send('Error 404 Not Found!')
})

app.listen(3000, function(req, res) {
  console.log('Server started at port 3000')
})