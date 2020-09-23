const express = require('express')
const hbs = require('hbs')
const mongoose = require('mongoose')
require('./db/mongoose')
const User = require('./models/user')

const app = express()

app.use(express.static('./public'))
app.set('view engine', 'hbs')
app.set('views', './public/templates/views')
hbs.registerPartials('./public/templates/partials')

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

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

app.get('/account', function (req, res) {
    res.render('login-registration.hbs', {
        title: 'Register'
    })
})

app.post('/register', async function(req, res) {
    try {
        const user = new User(req.body)
        await user.save()
        res.redirect('back')
    } catch (error) {
        res.redirect('back')
    }
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