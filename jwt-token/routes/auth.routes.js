const express = require('express')
const createError = require('http-errors')
const router = express.Router()
const User = require('../models/user.model')
const {authSchema} = require('../helpers/validation_schema')
const {signAccessToke, signAccessToken} = require('../helpers/jwt_helper')

// we create 4 routes - register, login, logout, refresh-token
router.post('/register', async(req, res, next)=>{
    console.log(req.body)
    // res.send("register route")
    try{
        // const {email, password} = req.body

        //if either emial or password is null
        // if(!email || !password) throw createError.BadRequest()
        const result = await authSchema.validateAsync(req.body)
        
        //check if the user is already registered in our database
        const de = await User.findOne({email: result.email})
        if(de) throw createError.Conflict(`${result.email} is already registered`)

        //register if above fails
        // const user = new User({email, password})
        const user = new User(result)
        const se = await user.save()

        const accesstoken = await signAccessToken(se.id)
        //send back saved user to response
        res.send({accesstoken})

    } catch (error) {
        //if the error is due to joi validation
        //422 - unprocessable entity
        if(error.isJoi == true) error.status = 422

        next(error)
    }
})
router.post('/login', async(req, res, next)=>{
    try{
        const result = await authSchema.validateAsync(req.body)
        //find the user in the collection by email
        const user = await User.findOne({email: result.email})
        //if user not found in database
        if(!user) throw createError.NotFound("user not registered")
        //match the password with re body incoming data and database
        //call from user model
        const isMatch = await user.isValidPassword(result.password)
        if(!isMatch) throw createError.Unauthorized('username/password not valid')
        //if the user is valid, generate new access token
        const accessToken = await signAccessToken(user.id)
        res.send({accessToken})
    }catch(error){
        if(error.isJoi == true) return next(createError.BadRequest("invalid username/password"))
        next(error)
    }
})
router.post('/logout', async(req, res, next)=>{
    res.send("logout route")
})
router.post('/refresh-token', async(req, res, next)=>{
    res.send("refresh token route")
})

module.exports = router