const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

//bcrypt middleware firing
userSchema.pre('save', async function (next) {
    try{
        // console.log("called before saving a user")
        //salt to hash our passwords, 10 -> number of rounds (time to generate that salt)
        const salt = await bcrypt.genSalt(10)
        // console.log(this.email, this.password)
        //to hash the password 
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()

    } catch(error) {
        next(error)
    }
})

userSchema.methods.isValidPassword = async function (password) {
    try{
        //boolean if the password matches
        return await bcrypt.compare(password, this.password)
    } catch(error){
        throw error
    }

}

const User = mongoose.model('user', userSchema)
module.exports = User