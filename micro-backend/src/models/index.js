const sequelize = require('../config/sequelize')
const Sequelize = require('sequelize')
const Filmes = require('./filmes')

const filmes = Filmes (sequelize, Sequelize.DataTypes)

const db = {
    filmes
}

module.exports = db