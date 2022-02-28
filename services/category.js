const { 
    equalsOrError, 
    existsOrError, 
    notExistsOrError, 
} = require('../utils/validation')
const createResponse = require('../utils/response')
const statusCode = require('../domain/enums/statusCode')
const categoryRepository = require('../repositories/category')
const Category = require('../domain/models/category')

async function get() {
    let category = await categoryRepository.get()
    return createResponse(statusCode.OK, null, category)
}

async function getById(id) {
    let category = await categoryRepository.getById(id)
    return createResponse(statusCode.OK, null, category)
}

async function save(category, id = null) {
    if (id) category.id = id

    try {   
        existsOrError(category.name, 'Nome não informado')
    } catch(msg) {
        return createResponse(statusCode.BADREQUEST, msg)
    }

    const categoryModel = Category(category)

    if (category.id) {
        try {
            await categoryRepository.update(categoryModel, category.id)
            return createResponse(statusCode.OK, 'Categoria alterada')
        } catch(err) {
            console.error(err)
            return createResponse(statusCode.INTERNALSERVERERROR, err)
        }
    } else {
        try {
            await categoryRepository.save(categoryModel)
            return createResponse(statusCode.OK, 'Categoria inserida')
        } catch(err) {
            return createResponse(statusCode.INTERNALSERVERERROR, err)
        }
    }
}

module.exports = {
    get,
    getById,
    save,
}