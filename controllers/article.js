const express = require('express')
const router = express.Router()
const articleService = require('../services/article')

// http://localhost:3000/article
router.route('/')
    .get(async (req, res) => {
        const response = await articleService.get(req.query.page)
        res.status(response.status).json(response)
    })
    .post(async (req, res) => {
        const response = await articleService.save(req.body)
        res.status(response.status).json(response)
    })

router.route('/:id')
    .get(async (req, res) => {
        const response = await articleService.getById(req.params.id)
        res.status(response.status).json(response)
    })
    .put(async (req, res) => {
        const response = await articleService.save(req.body, req.params.id)
        res.status(response.status).json(response) 
    })
    .delete(async(req, res) => {
        const response = await articleService.remove(req.params.id)
        res.status(response.status).json(response)
    })

module.exports = router

