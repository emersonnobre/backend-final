const { 
    equalsOrError, 
    existsOrError, 
    notExistsOrError, 
} = require('../utils/validation')
const createResponse = require('../utils/response')
const statusCode = require('../domain/enums/statusCode')
const categoryRepository = require('../repositories/category')
const articleRepository = require('../repositories/article')
const Category = require('../domain/models/category')

async function get() {
    let categories = await categoryRepository.get()
    return createResponse(statusCode.OK, null, withPath(categories))
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
            console.error(err)
            return createResponse(statusCode.INTERNALSERVERERROR, err)
        }
    }
}

async function remove(id) {
    try {
        const subcategory = await categoryRepository.getWhere({ parentId: id })
        notExistsOrError(subcategory, 'Categoria possui subcategorias')

        const articles = await articleRepository.getWhere({ categoryId: id })
        notExistsOrError(articles, 'Categoria possui artigos')

        const rowsDeleted = await categoryRepository.remove(id)
        existsOrError(rowsDeleted, 'Categoria não encontrada')

        return createResponse(statusCode.OK)
    } catch(err) {
        return createResponse(statusCode.BADREQUEST, msg)
    }
}

function withPath(categories) {
    console.log(JSON.stringify(categories, 2, null))
    const getParent = (categories, parentId) => {
        const parent = categories.filter(parent => parent.id === parentId)
        return parent.length ? parent[0] : null
    }

    const categoriesWithPath = categories.map(category => {
        let path = category.name
        let parent = getParent(categories, category.parentId)

        while(parent) {
            path = `${parent.name} > ${path}`
            parent = getParent(categories, parent.parentId)
        }

        return {...category, path}
    })

    categoriesWithPath.sort((a, b) => {
        if (a.path < b.path) return -1
        if (a.path > b.path) return 1
        return 0
    })

    return categoriesWithPath
} 

module.exports = {
    get,
    getById,
    save,
    remove,
}