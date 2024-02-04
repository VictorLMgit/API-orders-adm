const db = require('./../DataBase/db.js');
class UserController {
    static async getUsers(req, res) {

        try {
            const result = await db.query('SELECT * FROM users');
            res.json(result.rows);
        } catch (error) {
            console.error('Erro na consulta ao banco de dados:', error);
            res.status(500).json({ error: 'Erro interno no servidor' });
        }

    }
    static async getUsersByID(req, res) {

        try {
            const result = await db.query('SELECT * FROM users where id = ' + req.params.id);
            res.json(result.rows);
        } catch (error) {
            console.error('Erro na consulta ao banco de dados:', error);
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }
    static async updateUser(req, res) {
        const userId = req.params.id;
        const updatedData = req.body;
        const updateFields = Object.keys(updatedData).map((key, index) => {
            return `${key} = $${index + 1}`;
        });

        try {
            // Construir a consulta SQL
            const updateQuery = `
            UPDATE users
            SET ${updateFields.join(',')}
            WHERE id = $${Object.keys(updatedData).length + 1}
            `;
            const values = Object.values(updatedData);
            values.push(userId);
            // Executar a consulta SQL
            const result = await db.query(updateQuery, values);
            res.json({
                msg: `Usuário com ID ${userId} atualizado com sucesso!`
            });
        } catch (error) {
            console.error('Erro na consulta ao banco de dados:', error);
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }

    static async deleteUser(req, res) {

        try {
            const result = await db.query('DELETE FROM users where id = ' + req.params.id);
            res.json({
                msg: "Deletado com sucesso"
            });
        } catch (error) {
            console.error('Erro na consulta ao banco de dados:', error);
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }

    static async postUser(req, res) {

        try {
            const { name, login, password, isactive, created_at, permissions } = req.body;

            const verify = await db.query("SELECT * FROM users where login = '" + login + "' limit 1");

            if (verify.rowCount > 0) {
                const erro = new Error("Login ja existente");
                erro.code = "UE13";
                throw erro;
            }

            const query = "insert into users (name, login, password, isactive, created_at, permissions) VALUES ($1, $2, $3, $4, $5, $6)";

            await db.query(query, [name, login, password, isactive, created_at, permissions]);

            res.status(201).json({
                "Message": "Usuario inserido com sucesso"
            })
        } catch (error) {
            console.error('Erro na consulta ao banco de dados:', error);

            if (error.code === '23502') {
                // Código de erro '23502' geralmente indica uma violação de NOT NULL (coluna obrigatória)
                res.status(400).json({ error: 'Erro: A coluna: ' + error.column + " é obrigatória" });
            } else if (error.code == 'UE13') {
                res.status(400).json({ error: "Login já cadastrado" });
            }
            else {
                res.status(500).json({ error: error });
            }
        }
    }
}


module.exports = UserController;