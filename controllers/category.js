const express = require('express')
const router = express.Router()
const categoryService = require('../services/category')

// http://localhost:3000/category
router.route('/')
    .get(async (req, res) => {
        const response = await categoryService.get()
        res.status(response.status).json(response)
    })
    .post(async (req, res) => {
        const response = await categoryService.save(req.body)
        res.status(response.status).json(response)
    })

router.route('/:id')
    .get(async (req, res) => {
        const response = await categoryService.getById(req.params.id)
        res.status(response.status).json(response)
    })
    .put(async (req, res) => {
        const response = await categoryService.save(req.body, req.params.id)
        res.status(response.status).json(response) 
    })
    .delete(async(req, res) => {

    })

module.exports = router