const express = require('express')
const sequelize = require('./config/sequelize');

const app = express()
const port = 3000
const host = '0.0.0.0'
app.use(express.json())

const routers = require('./api')

app.use('/', routers)

sequelize.sync({ force: false }).then(() => {
    console.log('Conectado ao banco de dados e sincronizado com sucesso.');
}).catch(err => {
    console.error('Erro ao conectar e sincronizar o banco de dados:', err);
});

app.listen(port, host)