const express = require('express')
const router = express.Router()
const authService = require('../services/auth')

// http://localhost:3000/auth
router.route('/signin')
    .post(async (req, res) => {
        const response = await authService.signin(req.body.email, req.body.password)
        res.status(response.status).json(response)
    })

module.exports = router

