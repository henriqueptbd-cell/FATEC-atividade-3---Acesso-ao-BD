// importando o pool
const pool = require('./connection');

// função para listar os usuários
async function listUsers() {
    const sql = 'SELECT * FROM users ORDER BY name ASC;';
    const { rows } = await pool.query(sql);
    return rows;
}

async function createUser(name, email) {
    const sql = `INSERT INTO users (name,email)
                VALUES ($1,$2)
                RETURNING *`;
    const values = [name, email];
    const { rows } = await pool.query(sql, values);
    return rows;
}

async function deleteUser(id) {
    const sql = `DELETE FROM users
                WHERE id_user = $1
                RETURNING *`;
    const values = [id];
    const response = await pool.query(sql, values);
    if (response.rowCount == 1) {
        return response.rows[0];
    } else {
        return { message: 'Usuário não encontrado' };
    }

}

// exportando as funções
module.exports = {
    listUsers,
    createUser,
    deleteUser
}