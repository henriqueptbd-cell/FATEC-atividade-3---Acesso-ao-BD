//importando as bibliotecas
const express = require('express');
const router = express.Router();

//importando as funções
const { listUsers, createUser, deleteUser } = require('../database/users');

//criando as rotas
router.get('/', async function (_req, res) {
    const users = await listUsers();
    res.status(200).json(users);
});

router.post('/', async function (req, res) {
    const { name, email } = req.body;
    const user = await createUser(name, email);
    res.status(201).json(user);
});

// http://localhost:3003/users/2
// curl -X DELETE http://localhost:3003/users/3
router.delete('/:id', async function (req, res) {
    const id = req.params.id;
    const user = await deleteUser(id);
    if (user.message) {
        res.status(404).json(user);
    } else {
        res.status(200).json(user);
    }
});


module.exports = router;