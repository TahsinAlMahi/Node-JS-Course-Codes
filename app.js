const express = require('express')
const hbs = require('hbs')
const mongoose = require('mongoose')
const session = require('express-session')
require('./db/mongoose')
const passport = require('passport')
const {authentication, secureAuthentication} = require('./authentication/auth')
const User = require('./models/user')
const Post = require('./models/post')

const app = express()

app.use(session({
    secret: 'mango',
    resave: false,
    saveUninitialized: false
}))

app.use(express.static('./public'))
app.set('view engine', 'hbs')
app.set('views', './public/templates/views')
hbs.registerPartials('./public/templates/partials')

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => { //This middleware checks the local user
    res.locals.user = req.user
    next()
})

app.get('/', function (req, res) {
    const user = res.locals.user
    if(user && user.admin === true) {
        var admin = true
    }
    Post.find({}, function(err, posts) {
        res.render('index.hbs', {
            title: 'Home',
            posts: posts,
            admin: admin
        })
    })
})

app.get('/edit/:id', secureAuthentication, async function(req, res) {
    const id = req.params.id
    await Post.findById(id, function(err, posts) {
        res.render('edit.hbs', {
            posts: posts
        })
    })
})

app.post('/edit/:id', async function(req, res) {
    const id = req.params.id

    const post = {}
    post.title = req.body.title
    post.author = req.body.author
    post.content = req.body.content
    
    await Post.findByIdAndUpdate(id, post)

    res.redirect('/')
})

app.get('/delete/:id', secureAuthentication, async function(req, res) {
    const id = req.params.id
    await Post.findByIdAndRemove(id)
    res.redirect('back')
})

app.get('/about', secureAuthentication, function (req, res) {
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

app.post('/login', async function(req, res, next) {
    try {
        await passport.authenticate('local', {
            successRedirect: '/profile',
            failureRedirect: '/'
        })(req, res, next)
    } catch (error) {
        res.redirect('back')
    }
})

app.get('/profile', secureAuthentication, function(req, res) {
    res.render('profile.hbs', {
        user: req.user
    })
})

app.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
})

app.post('/post', async function(req, res) {
    const post = new Post(req.body)
    await post.save()
    res.redirect('back')
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