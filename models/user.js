const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    admin: {
        type: Boolean,
        default: false
    }
}).pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

const User = mongoose.model('User', userSchema, 'users')

module.exports = User