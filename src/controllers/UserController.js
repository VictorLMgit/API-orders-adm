const db = require('./../DataBase/db.js');
const userReporisory = require("./../repositories/userReporisory.js");
const Commom = require("../utilities/utils.js");
class UserController {
    static async getUsers(req, res) {

        try {
            if (!this.checkRoot(req.headers['authorization'])) throw Commom.newErro("Nao autorizado", "NA13");
            const result = await db.query('SELECT * FROM users');
            res.json(result.rows);
        } catch (error) {

            if (error.code == "NA13") {
                res.status(401).json({ error: 'Nao autorizado!' });
            } else {
                console.error('Erro na consulta ao banco de dados:', error);
                res.status(500).json({ error: 'Erro interno no servidor' });
            }

        }

    }
    static async getUsersByID(req, res) {

        try {
            if (!this.checkRoot(req.headers['authorization'])) throw Commom.newErro("Nao autorizado", "NA13");
            const result = await db.query('SELECT * FROM users where id = ' + req.params.id);
            res.json(result.rows);
        } catch (error) {
            if (error.code == "NA13") {
                res.status(401).json({ error: 'Nao autorizado!' });
            } else {
                console.error('Erro na consulta ao banco de dados:', error);
                res.status(500).json({ error: 'Erro interno no servidor' });
            }
        }
    }
    static async updateUser(req, res) {

        try {
            if (!this.checkRoot(req.headers['authorization'])) throw Commom.newErro("Nao autorizado", "NA13");
            const userId = req.params.id;
            const updatedData = req.body;
            const updateFields = Object.keys(updatedData).map((key, index) => {
                return `${key} = $${index + 1}`;
            });
            const updateQuery = `
            UPDATE users
            SET ${updateFields.join(',')}
            WHERE id = $${Object.keys(updatedData).length + 1}
            `;
            const values = Object.values(updatedData);
            values.push(userId);

            const result = await db.query(updateQuery, values);
            res.json({
                msg: `Usuário com ID ${userId} atualizado com sucesso!`
            });
        } catch (error) {
            if (error.code == "NA13") {
                res.status(401).json({ error: 'Nao autorizado!' });
            } else {
                console.error('Erro na consulta ao banco de dados:', error);
                res.status(500).json({ error: 'Erro interno no servidor' });
            }
        }
    }

    static async deleteUser(req, res) {

        try {

            if (!this.checkRoot(req.headers['authorization'])) throw Commom.newErro("Nao autorizado", "NA13");
            const result = await db.query('DELETE FROM users where id = ' + req.params.id);
            res.json({
                msg: "Deletado com sucesso"
            });
        } catch (error) {
            if (error.code == "NA13") {
                res.status(401).json({ error: 'Nao autorizado!' });
            } else if (error.code == "23503"){
                res.status(400).json({ error: 'Esse usuario está vinculado com elementos em outras tabelas' });
            } 
            else {
                console.error('Erro na consulta ao banco de dados:', error);
                res.status(500).json({ error: 'Erro interno no servidor' });
            }
        }
    }

    static async postUser(req, res) {

        try {
            await userReporisory.create(req.body);
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
                res.status(500).json({ error: process.env.PASSWORD });
            }
        }
    }

    static checkRoot(auth) {
        return auth == process.env.MASTER_KEY;
    }
}


module.exports = UserController;