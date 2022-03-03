const bcrypt = require('bcrypt-nodejs')
const { 
    equalsOrError, 
    existsOrError, 
    notExistsOrError, 
} = require('../utils/validation')
const createResponse = require('../utils/response')
const userToResponse = require('../domain/dto/userToResponse')
const { OK, BADREQUEST, INTERNALSERVERERROR, } = require('../domain/enums/statusCode')
const userRepository = require('../repositories/user')
const User = require('../domain/models/user')

async function get() {
    let users = await userRepository.get()
    if (users.length)
        users = users.map(user => userToResponse(user))
    return createResponse(OK, null, users)
}

async function getById(id) {
    let user = await userRepository.getById(id)
    if (user)
        user = userToResponse(user)
    return createResponse(OK, null, user)
}

async function save(user, id = null) {
    if (id) user.id = id

    try {   
        existsOrError(user.name, 'Nome não informado')
        existsOrError(user.email, 'E-mail não informado')
        existsOrError(user.password, 'Senha não informada')
        existsOrError(user.confirmPassword, 'Confirmação de senha não informada')
        equalsOrError(user.password, user.confirmPassword, 'As senhas não coincidem')

        const userFromDb = await userRepository.getByEmail(user.email)

        if (!user.id) {
            notExistsOrError(userFromDb, 'Usuário já cadastrado')
        }
    } catch(msg) {
        return createResponse(BADREQUEST, msg)
    }

    user.password = encryptPassword(user.password)
    delete user.confirmPassword

    const userModel = User(user)

    if (user.id) {
        try {
            await userRepository.update(userModel, user.id)
            return createResponse(OK, 'Usuário alterado')
        } catch(err) {
            console.error(err)
            return createResponse(INTERNALSERVERERROR, err)
        }
    } else {
        try {
            await userRepository.save(userModel)
            return createResponse(OK, 'Usuário inserido')
        } catch(err) {
            return createResponse(INTERNALSERVERERROR, err)
        }
    }
}

function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

module.exports = {
    get,
    getById,
    save,
}