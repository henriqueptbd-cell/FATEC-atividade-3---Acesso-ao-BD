// importando as bibliotecas
const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const port = process.env.PORT
const usersRouter = require('./routes/users.routes')

// carregando as variaveis de ambiente
dotenv.config({
    quiet: true,
    path: path.resolve(__dirname, '../.env')
})

// variavel de ambiente
const PORT = process.env.PORT;

// criando o servidor
const app = express();

app.use(express.json());

app.listen(PORT, function (){
    console.log(`Rodando em http://localhost:${PORT}`);
})

// configurando o servidor
const publicpath = path.join(__dirname, '../public');
const assetspath = path.join(publicpath, 'assets');
const pagespath = path.join(publicpath, '/pages');

// configurando as rotas para a pagina principal
app.use('/', express.static(pagespath));

// configurando as rotas para os arquivos estaticos
app.use('/assets', express.static(assetspath));

// configurando as rotas para as rotas
app.use('/users', usersRouter);
