# Atividade 3 - Acesso ao BD

Aplicação web para cadastro de usuários com acesso a banco de dados PostgreSQL, desenvolvida como atividade da disciplina de Desenvolvimento Web I do curso DSM.

## link para acesso ao site

- https://fatec-atividade-3-acesso-ao-bd.onrender.com/

## Tecnologias

- **Node.js** com Express 5
- **PostgreSQL** via biblioteca `pg`
- **dotenv** para variáveis de ambiente
- HTML, CSS e JavaScript no frontend

## Estrutura do projeto

```
├── public/
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   └── pages/
│       └── index.html
├── src/
│   ├── database/
│   │   ├── connection.js   # Configuração do pool de conexão
│   │   └── users.js        # Funções de acesso ao banco
│   ├── routes/
│   │   └── users.routes.js # Rotas da API REST
│   └── server.js           # Entrada da aplicação
├── .env
└── package.json
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3000

# Conexão individual
POSTGRES_HOST=localhost
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_BD=nome_do_banco
POSTGRES_PORT=5432

# Ou via connection string (tem prioridade se definida)
# DATABASE_URL=postgresql://usuario:senha@host:5432/banco
```

O banco deve ter a tabela `users` criada:

```sql
CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    email   VARCHAR(100) NOT NULL
);
```

## Instalação e execução

```bash
npm install
npm run dev    # modo desenvolvimento (hot reload)
npm start      # modo produção
```

Acesse em: `http://localhost:<PORT>`

## Diagramas UML

### Diagrama de Classes

```mermaid
classDiagram
    class Server {
        +app: Express
        +PORT: number
        +listen(PORT)
        +use(path, middleware)
    }

    class UsersRouter {
        +GET /(req, res)
        +POST /(req, res)
        +DELETE /:id(req, res)
    }

    class UsersDB {
        +listUsers() Array
        +createUser(name, email) Array
        +deleteUser(id) Object
    }

    class Connection {
        +pool: Pool
        +config: Object
    }

    class PostgreSQL {
        <<database>>
        +users: Table
    }

    Server --> UsersRouter : registra /users
    UsersRouter --> UsersDB : chama funções
    UsersDB --> Connection : executa queries
    Connection --> PostgreSQL : conecta via Pool
```

### Diagrama de Sequência

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend
    participant Server
    participant UsersRouter
    participant UsersDB
    participant PostgreSQL

    Note over Usuario, PostgreSQL: Listar usuários (GET /users)
    Usuario->>Frontend: acessa a página
    Frontend->>Server: GET /users
    Server->>UsersRouter: roteia requisição
    UsersRouter->>UsersDB: listUsers()
    UsersDB->>PostgreSQL: SELECT * FROM users ORDER BY name ASC
    PostgreSQL-->>UsersDB: rows[]
    UsersDB-->>UsersRouter: rows[]
    UsersRouter-->>Server: res.status(200).json(users)
    Server-->>Frontend: 200 OK + JSON
    Frontend-->>Usuario: renderiza tabela

    Note over Usuario, PostgreSQL: Cadastrar usuário (POST /users)
    Usuario->>Frontend: preenche nome e e-mail e clica Salvar
    Frontend->>Server: POST /users {name, email}
    Server->>UsersRouter: roteia requisição
    UsersRouter->>UsersDB: createUser(name, email)
    UsersDB->>PostgreSQL: INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *
    PostgreSQL-->>UsersDB: novo registro
    UsersDB-->>UsersRouter: rows[]
    UsersRouter-->>Server: res.status(201).json(user)
    Server-->>Frontend: 201 Created + JSON
    Frontend-->>Usuario: exibe confirmação

    Note over Usuario, PostgreSQL: Remover usuário (DELETE /users/:id)
    Usuario->>Frontend: clica em excluir
    Frontend->>Server: DELETE /users/:id
    Server->>UsersRouter: roteia requisição
    UsersRouter->>UsersDB: deleteUser(id)
    UsersDB->>PostgreSQL: DELETE FROM users WHERE id_user = $1 RETURNING *
    alt usuário encontrado
        PostgreSQL-->>UsersDB: registro deletado
        UsersDB-->>UsersRouter: objeto do usuário removido
        UsersRouter-->>Server: res.status(200).json(user)
        Server-->>Frontend: 200 OK + JSON
    else usuário não encontrado
        PostgreSQL-->>UsersDB: rowCount = 0
        UsersDB-->>UsersRouter: {message: "Usuário não encontrado"}
        UsersRouter-->>Server: res.status(404).json(message)
        Server-->>Frontend: 404 Not Found
    end
    Frontend-->>Usuario: atualiza tabela
```

## API

| Método | Rota          | Descrição                  |
|--------|---------------|----------------------------|
| GET    | `/users`      | Lista todos os usuários    |
| POST   | `/users`      | Cadastra um novo usuário   |
| DELETE | `/users/:id`  | Remove um usuário pelo ID  |

### Exemplos

```bash
# Listar usuários
curl http://localhost:3000/users

# Cadastrar usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João", "email": "joao@email.com"}'

# Deletar usuário
curl -X DELETE http://localhost:3000/users/1
```
