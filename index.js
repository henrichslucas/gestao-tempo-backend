const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8082;


// Configurando cors para permitir acesso de qualquer origem
app.use(cors())


// Configuração do MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "lucas_admin",
  password: "2242",
  database: "pae_db",
  port: "3306",
});

// Conexão do MySQL
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL: " + err.message);
  } else {
    console.log("Conectado ao MySQL");
  }
});

// Middleware para análise do corpo da solicitação
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ROTAS

// Rota para adicionar um novo registro no formulário
app.post("/add", cors(), (req, res) => {
  const { title, date, start, end, backgroundColor } = req.body;
  const query =
    "INSERT INTO formulario (nome, data, hora_inicio, hora_fim, cor) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [title, date, start, end, backgroundColor],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir registro: " + err.message);
        res.status(500).send("Erro ao inserir registro.");
      } else {
        console.log("Registro inserido com sucesso");
        //res.status(201).send('Registro inserido com sucesso.');
      }
    }
  );
});

app.get("/list", cors(), (req, res) => {
  const query = "SELECT * FROM formulario";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Erro ao listar registros: " + err.message);
      res.status(500).send("Erro ao listar registros.");
    } else {
      console.log("Registros listados com sucesso");
      res.status(200).send(result);
    }
  });
})


// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta url http://localhost:${port}`);
});
