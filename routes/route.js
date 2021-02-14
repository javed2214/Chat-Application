const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = mongoose.model('User')

checkAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

checkNotAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return res.redirect('/chat')
    }
    next()
}

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
    var user = new User()
    user.name = req.body.name
    user.email = req.body.email
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    user.password = hashedPassword
    try{
        await user.save()
        console.log('Record Saved')
        res.redirect('/login')
    } catch(err){
        console.log('Error in Saving Record')
    }
})

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/chat',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

router.get('/chat', checkAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

module.exports = router