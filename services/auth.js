require('dotenv').config()
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const { existsOrError } = require('../utils/validation')
const createResponse = require('../utils/response')
const statusCode = require('../domain/enums/statusCode')
const userRepository = require('../repositories/user')

async function signin(email, password) {
    let user 

    try {
        existsOrError(email, 'Informe o e-mail')
        existsOrError(password, 'Informe a senha')
    } catch(error) {
        return createResponse(statusCode.BADREQUEST, error)
    }

    try {
        user = await userRepository.getByEmail(email)
        existsOrError(user, 'E-mail não cadastrado')

        const isMatch = bcrypt.compareSync(password, user.password)
        if (!isMatch) {
            throw 'Email/senha inválidos'
        } 
    } catch(error) {
        return createResponse(statusCode.UNAUTHORIZED, error)
    }

    const now = Math.floor(Date.now() / 1000) //momento atual em segundos

    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
        iat: now,
        exp: now + (60 * 60) // 1 hora a partir da criação para expirar
    }

    return {
        ...createResponse(statusCode.OK, null),
        ...payload,
        token: jwt.encode(payload, process.env.AUTH_SECRET)
    }
}

module.exports = {
    signin, 
}
