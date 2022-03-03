const { 
    existsOrError, 
    notExistsOrError, 
    numberOrError,
} = require('../utils/validation')
const createResponse = require('../utils/response')
const { OK, BADREQUEST, INTERNALSERVERERROR, NOCONTENT, CREATED, } = require('../domain/enums/statusCode')
const categoryRepository = require('../repositories/category')
const articleRepository = require('../repositories/article')
const Category = require('../domain/models/category')

async function get() {
    try {
        let categories = await categoryRepository.get()
        return createResponse(OK, null, withPath(categories))
    } catch (error) {
        console.log(error)
        return createResponse(INTERNALSERVERERROR, error)
    }
}

async function getById(id) {
    try {
        numberOrError(id, 'Id deve ser numérico')
    } catch (error) {
        return createResponse(BADREQUEST, error)
    }

    try {
        let category = await categoryRepository.getById(id)
        return createResponse(OK, null, category)
    } catch (error) {
        console.log(error)
        return createResponse(INTERNALSERVERERROR, error)
    }
}

async function save(category, id = null) {
    if (id) category.id = id

    try {   
        existsOrError(category.name, 'Nome não informado')
        if (category.id) {
            numberOrError(category.id, 'Id deve ser numérico')
        }
    } catch(error) {
        return createResponse(BADREQUEST, error)
    }

    const categoryModel = Category(category)

    if (category.id) {
        try {
            await categoryRepository.update(categoryModel, category.id)
            return createResponse(NOCONTENT, null)
        } catch(error) {
            console.log(error)
            return createResponse(INTERNALSERVERERROR, error)
        }
    } else {
        try {
            await categoryRepository.save(categoryModel)
            return createResponse(CREATED, null)
        } catch(error) {
            console.log(error)
            return createResponse(INTERNALSERVERERROR, error)
        }
    }
}

async function remove(id) {
    try {
        numberOrError(id, 'Id deve ser numérico')

        const subcategory = await categoryRepository.getWhere({ parentId: id })
        notExistsOrError(subcategory, 'Categoria possui subcategorias')

        const articles = await articleRepository.getWhere({ categoryId: id })
        notExistsOrError(articles, 'Categoria possui artigos')
    } catch(error) {
        return createResponse(BADREQUEST, error)
    }

    try {
        const rowsDeleted = await categoryRepository.remove(id)
        if (rowsDeleted === 0)
            return createResponse(BADREQUEST, 'Categoria não encontrada')
        return createResponse(NOCONTENT, null)
    } catch (error) {
        console.log(error)
        return createResponse(INTERNALSERVERERROR, error)
    }
}

function withPath(categories) {
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

function toTree(categories, tree) {
    if (!tree) tree = categories.filter(category => !category.parentId) //inicia a estrutura com as categorias pais do topo
    tree = tree.map(parentNode => {
        const isChild = node => node.parentId == parentNode.id
        parentNode.children = toTree(categories, categories.filter(isChild)) //procura as filhas do pai da vez e faz a recursividade
        return parentNode
    })
    return tree
}

async function getTree() {
    try {        
        const categories = await categoryRepository.get()
        return createResponse(OK, null, toTree(withPath(categories)))
    } catch (error) {
        console.log(error)
        return createResponse(INTERNALSERVERERROR, error)
    }
}

module.exports = {
    get,
    getById,
    getTree,
    save,
    remove,
}