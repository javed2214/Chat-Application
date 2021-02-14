const LocalStrategy = require('passport-local').Strategy
const  bcrypt = require('bcrypt')

const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = async (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        var user = await User.findOne({ email: email })
        if(user == null){
            return done(null, false, { message: 'Email is not Registered'})
        }
        await bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) console.log('Error in Comparing Password')
            if(isMatch){
                return done(null, user)
            } else{
                return done(null, false, { message: 'Password Incorrect'} )
            }
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}