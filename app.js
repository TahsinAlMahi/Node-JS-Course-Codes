const express = require('express')
const hbs = require('hbs')

const app = express()

app.use(express.static('./public'))
app.set('view engine', 'hbs')
app.set('views', './public/templates/views')
hbs.registerPartials('./public/templates/partials')

app.get('/', function (req, res) {
    res.render('index.hbs', {
        title: 'Home'
    })
})

app.get('/about', function (req, res) {
    res.render('about.hbs', {
        title: 'About us'
    })
})

app.get('*', function (req, res) {
    res.render('404.hbs', {
        title: 'দ্বিমিক পাঠশালা | 404'
    })
})

const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log('Server started on port ' + port)
})