const express = require('express');
const handlebars = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 8082;

// Configuração do MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'lucas_admin',
  password: '2242',
  database: 'pae_db',
  port:'3306'
});

// Conexão do MySQL
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL: ' + err.message);
  } else {
    console.log('Conectado ao MySQL');
  }
});

// Middleware para análise do corpo da solicitação
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Rotas

app.get('/',  (req,res) =>{
    res.redirect('/form');
})


// Rota para renderizar o formulario
app.get('/form',  (req,res) =>{
    res.render('form.handlebars');
})

app.get('/add',  (req,res) =>{
    res.render('add.handlebars');
})

// Rota para adicionar um novo registro no formulário
app.post('/add', (req, res) => {
    const { nome, data_atividade, hora_inicio, hora_fim, cor } = req.body;
    const query = 'INSERT INTO formulario (nome, data, hora_inicio, hora_fim, cor) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nome, data_atividade, hora_inicio, hora_fim, cor], (err, result) => {
      if (err) {
        console.error('Erro ao inserir registro: ' + err.message);
        res.status(500).send('Erro ao inserir registro.');
      } else {
        console.log('Registro inserido com sucesso');
        //res.status(201).send('Registro inserido com sucesso.');
        res.render('add.handlebars');
      }
    });
});

// Rota para listar todos os registros no formulário
app.get('/read', (req, res) => {
  const query = 'SELECT * FROM formulario';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar registros: ' + err.message);
      res.status(500).send('Erro ao buscar registros.');
    } else {
      res.json(results);
    }
  });
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta url http://localhost:${port}`);
});
