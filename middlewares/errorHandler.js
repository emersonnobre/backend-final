function errorHandler(err, req, res, next) {
    console.log(`ERRO CATCHADO: ${err}`)
    res.status(500).send('Erro interno, verique o console')
    next()
}

module.exports = errorHandler