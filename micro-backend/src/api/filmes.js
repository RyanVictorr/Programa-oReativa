const express = require('express');
const router = express.Router();
const { filmes } = require('../models');
const FilmeService = require('../services/filmes');

const filmeService = new FilmeService(filmes);

// Adicione esta linha para permitir a análise do corpo da requisição
router.use(express.json());

router.get('/buscar', async (req, res) => {
    try {
        const { nome } = req.body; // Mudamos de Nome para nome, pois os objetos em JavaScript são sensíveis a maiúsculas/minúsculas
        if (!nome) {
            throw new Error('O campo nome é obrigatório');
        }
        const resultados = await filmeService.BuscaPorNome(nome);
        res.json(resultados);
    } catch (erro) {
        console.error(erro.message); // Registre o erro
        res.status(400).json({ mensagem: erro.message }); // Envie uma resposta JSON
    }
});

module.exports = router;