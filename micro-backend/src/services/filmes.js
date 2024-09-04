const { Op } = require('sequelize');

class FilmeService {
    constructor(FilmeModel) {
        this.filmes = FilmeModel;
    }

    async BuscaPorNome(nome) {
        try {
            const filmes = await this.filmes.findAll({
                where: {
                    nome_filme: { [Op.iLike]: `%${nome}%` }
                },
                limit: 10 // Limit to 10 results
            });
            return filmes;
        } catch (erro) {
            console.error(erro.message);
            throw erro;
        }
    }
}

module.exports = FilmeService;