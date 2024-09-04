const express = require('express');
const kafka = require('kafka-node');
const fetch = require("node-fetch");
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new Producer(client);

// Configurar o evento 'ready' do Producer antes da requisição fetch
producer.on('ready', function () {
  console.log('Producer está pronto para enviar mensagens');
  
  // Fazer a requisição API
  const url = 'https://api.themoviedb.org/3/search/movie?query=Deadpool%20%26%20Wolverine&include_adult=false&language=pt-BR&page=1&year=2024';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MmVjODMxNWM3YzEyMzBkMzYxNjZjZWRkZGUxN2YwZiIsIm5iZiI6MTcyNTQxNDY0Ny42NzEyMDUsInN1YiI6IjY2ZDQ3NGI1ZWE3M2E0ZmUxMDk0NzBjZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.slIREwbwhiI1vXs2HYHZ46tkrXUrloY6rIed_Aom-C4'
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => {
      // Serializa o objeto JSON
      const serializedJson = JSON.stringify(json);
      // Verifica se a serialização foi bem-sucedida
      if (serializedJson === '[object Object]') {
        console.error('Falha ao serializar o objeto JSON');
        return;
      }

      // Envia a mensagem para o Kafka
      const payloads = [
        { topic: 'my-topic-teste', messages: serializedJson, partition: 0 }
      ];
      
      producer.send(payloads, function (err, data) {
        if (err) {
          console.error('Erro ao enviar mensagem', err);
        } else {
          console.log('Mensagem enviada com sucesso', data);
        }
      });
    })
    .catch(err => console.error('error:' + err));
});

// Configura o app Express
const app = express();
app.use(express.json())

const port = 5000;
const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});
