const express = require('express');
const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const { Sequelize, DataTypes } = require('sequelize');

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });

const consumer = new Consumer(
  client,
  [{ topic: 'my-topic-teste', partition: 0 }],
  { autoCommit: true }
);

// Configuração do Sequelize para conectar ao PostgreSQL
const sequelize = new Sequelize('mydatabase', 'user', 'example', {
  host: 'db',
  dialect: 'postgres',
});

// Definição do modelo Filmes
function defineFilmeModel(sequelize, DataTypes) {
  return sequelize.define('Filmes',{
    id_Filme:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nome_filme:{
      type: DataTypes.STRING,
      allowNull: false,
    },

    descricao:{
      type: DataTypes.STRING,
    },

    avaliacao:{
      type: DataTypes.FLOAT
    },

    data_lancamento:{
      type: DataTypes.DATEONLY
    },

    image:{
      type: DataTypes.STRING
    }
  },  
  {
    createdAt: false,
    updatedAt: false,
    id:false,
    tableName: 'filmes',
    foreignKey: false
  });
}

// Configuração do Express
const app = express();
app.use(express.json())

const port = 4000;
const host = '0.0.0.0';

// Definir o modelo Filmes
const filmes = defineFilmeModel(sequelize, DataTypes);

// Função para salvar filme no banco de dados
async function saveFilm(filmData) {
  try {
    await sequelize.sync(); // Cria ou sincroniza o modelo no banco de dados
    const film = await filmes.create({
      nome_filme: filmData.title,
      descricao: filmData.overview,
      avaliacao: filmData.vote_average,
      data_lancamento: filmData.release_date,
      image: filmData.poster_path
    });
    console.log('Filme salvo com sucesso:', film.toJSON());
  } catch (error) {
    console.error('Erro ao salvar filme:', error);
  }
}

// Função para processar uma única mensagem
async function processMessage(message) {
  try {
    console.log('Mensagem recebida:', message.value);
    
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message.value);
    } catch (error) {
      console.error('Erro ao parsear mensagem:', error);
      return;
    }

    // Extrair os filmes da mensagem
    const films = parsedMessage.results || [];

    // Processar cada filme
    await Promise.all(films.map(async filmData => {
      await saveFilm(filmData);
    }));

    console.log('Mensagem processada com sucesso.');
  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
  }
}

// Evento para consumir mensagens do Kafka
consumer.on('message', async function (message) {
  await processMessage(message);
});

// Evento para erros do consumer
consumer.on('error', function (err) {
  console.error('Erro no consumer', err);
});

app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});