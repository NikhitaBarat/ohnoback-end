const JWT = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) =>{
            const payload = {
            }
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                // expiration: "1h",
                issuer: "dr.com",
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) =>{
                if(err) reject(err)
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        //if the authorization is not present in the request header simply return and call the next
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        //to split bearer and rest part
        const bearerToken = authHeader.split(' ')
        //for the actual token 
        const token = bearerToken[1]
        //verify the token
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) =>{
            if(err){
                return next(createError.Unauthorized())
            } 
            req.payload = payload
            next()
        })
    }
}