const express = require('express')

const filmesRouter = require('./filmes.js')

const router = express.Router()

router.use('/filmes', filmesRouter)

module.exports = router;