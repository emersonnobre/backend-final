const express = require('express')
const router = express.Router()
const userService = require('../services/user')

// http://localhost:3000/user
router.route('/')
    .get(async (req, res) => {
        const response = await userService.get()
        res.status(response.status).json(response)
    })
    .post(async (req, res) => {
        const response = await userService.save(req.body)
        res.status(response.status).json(response)
    })

router.route('/:id')
    .get(async (req, res) => {
        const response = await userService.getById(req.params.id)
        res.status(response.status).json(response)
    })
    .put(async (req, res) => {
        const response = await userService.save(req.body, req.params.id)
        res.status(response.status).json(response) 
    })
    .delete(async(req, res) => {

    })

module.exports = router