const { existsOrError, numberOrError, } = require('../utils/validation')
const createResponse = require('../utils/response')
const { OK, BADREQUEST, INTERNALSERVERERROR, CREATED, NOCONTENT, } = require('../domain/enums/statusCode')
const articleRepository = require('../repositories/article')
const userRepository = require('../repositories/user')
const categoryRepository = require('../repositories/category')
const staticQueries = require('../repositories/staticQueries')
const Article = require('../domain/models/article')

async function get(page = 1) {
    const limit = 10 //pagination

    try {
        const resultCount = await articleRepository.getCount()
        const count = parseInt(Object.values(resultCount)[0]) //pega o de fato o valor que vem no count e converte

        const articles = await articleRepository.getWithPagination(page, limit)
        return {
            ...createResponse(OK, null, articles),
            limit,
            count,
        }
    } catch (error) {
        console.log(`services > article > get()\n${error}`)
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
        let article = await articleRepository.getById(id)
        return createResponse(OK, null, article)
    } catch (error) {
        console.log(`services > article > getById()\n${error}`)
        return createResponse(INTERNALSERVERERROR, error)
    }
}

async function getByCategory(categoryId, page = 1) {
    const limit = 10

    try {
        const categories = await categoryRepository.get().raw(staticQueries.categoryWithChildrens, categoryId)
        const categoriesIds = categories.rows.map(category => category.id)
    
        const articles = articleRepository.getByCategories(categoriesIds, page, limit)
        return {
            ...createResponse(OK, null, articles),
            limit,
        }
    } catch(error) {
        console.log(`services > article > getByCategory()\n${error}`)
        return createResponse(INTERNALSERVERERROR, error)
    }

}

async function save(article, id = null) {
    if (id) article.id = id

    try {   
        existsOrError(article.name, 'Nome não informado')
        existsOrError(article.description, 'Descrição não informada')
        existsOrError(article.content, 'Conteúdo não informado')
        existsOrError(article.categoryId, 'Categoria não informada')
        existsOrError(article.userId, 'Autor não informado')
        numberOrError(article.categoryId, 'Id da categoria deve ser numérico')
        numberOrError(article.userId, 'Id do autor deve ser numérico')
        if (article.id) {
            numberOrError(article.id, 'Id deve ser numérico')
        }

        const user = await userRepository.getById(article.userId)
        existsOrError(user, 'Autor não encontrado')

        const category = await categoryRepository.getById(article.categoryId)
        existsOrError(category, 'Categoria não encontrada')
    } catch(error) {
        return createResponse(BADREQUEST, error)
    }

    const articleModel = Article(article)

    if (article.id) {
        try {
            await articleRepository.update(articleModel, article.id)
            return createResponse(NOCONTENT, null)
        } catch(error) {
            console.log(`services > article > save()\n${error}`)
            return createResponse(INTERNALSERVERERROR, error)
        }
    } else {
        try {
            await articleRepository.save(articleModel)
            return createResponse(CREATED, null)
        } catch(error) {
            console.log(`services > article > save()\n${error}`)
            return createResponse(INTERNALSERVERERROR, err)
        }
    }
}

async function remove(id) {
    try {
        numberOrError(id, 'Id deve ser numérico')
    } catch (error) {
        return createResponse(BADREQUEST, error)
    }

    try {
        const rowsDeleted = await articleRepository.remove(id)
        if (rowsDeleted === 0)
            return createResponse(BADREQUEST, 'Artigo não encontrado')
        return createResponse(NOCONTENT, null)
    } catch (error) {
        console.log(`services > article > remove()\n${error}`)
        return createResponse(INTERNALSERVERERROR, error)
    }
}

module.exports = {
    get,
    getById,
    getByCategory,
    save,
    remove,
}