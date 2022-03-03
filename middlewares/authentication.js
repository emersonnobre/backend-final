require('dotenv').config()
const jwt = require('jwt-simple')
const { UNAUTHORIZED, FORBIDDEN } = require('../domain/enums/statusCode')

function authentication(req, res, next) {
    const token = req.headers.authorization
    
    if (!token) return res.status(FORBIDDEN).send('No token provided')

    try {
        const tokenDecoded = jwt.decode(token.replace('Bearer ', ''), process.env.AUTH_SECRET)
        const expDate = new Date(tokenDecoded.exp * 1000)

        if (expDate <= new Date()) return res.status(UNAUTHORIZED).send('Expired token')
            
        next()
    } catch (error) {
        return res.status(UNAUTHORIZED).send('Invalid token')
    }
}

module.exports = authentication