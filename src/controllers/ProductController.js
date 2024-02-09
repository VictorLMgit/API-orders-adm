const db = require('./../DataBase/db.js');

class ProductController {

    static async getProducts(req, res) {

        try {
            const auth = req.headers['authorization'];
            const user_id = await this.getUserByToken(auth);
            const query = `SELECT * from products where user_id = '${user_id}'`;
            const products = await db.query(query);
            res.status(200).json(products.rows);
        } catch (error) {
            res.status(500).json({
                erro: error
            });
        }
    }

    static async updateProduct(req, res) {
        
        try {
            const auth = req.headers['authorization'];
            const user_id = await this.getUserByToken(auth);
            const productId = req.params.id;
            const q = `SELECT id FROM products WHERE id = '${productId}' and user_id = '${user_id}'`;
            const verify = await db.query(q);
    
            if (verify.rowCount == 0)  throw this.newErro("Sem permissão", "UN13");

            const updatedData = req.body;

            if ( updatedData.user_id != user_id && updatedData.user_id != null ) throw this.newErro("invalid argument", "IA13");

            const updateFields = Object.keys(updatedData).map((key, index) => {
                return `${key} = $${index + 1}`;
            });

            const updateQuery = `
            UPDATE products+
            SET ${updateFields.join(',')}
            WHERE id = $${Object.keys(updatedData).length + 1}
            `;
            const values = Object.values(updatedData);
            values.push(productId);

            const result = await db.query(updateQuery, values);
            res.json({
                msg: `Produto com ID ${productId} atualizado com sucesso!`
            });
        } catch (error) {
            if (error.code == "UN13") {
                res.status(400).json({ error: 'Produto não existente ou você não tem permissão para atualizar esse produto' });
            } else if (error.code == "IA13") {
                res.status(400).json({ error: 'user id nao pode ser alterado' });
            } else {
                console.error('Erro na consulta ao banco de dados:', error);
                res.status(500).json({ error: 'Erro interno no servidor' });
            }
        }
    }

    static async postProduct(req, res) {

        try {
            const auth = req.headers['authorization'];
            const user_id = await this.getUserByToken(auth);
            const { name, value, photo_url, avaiable, date, quantity, description} = req.body;

            const query = "insert into products (name, value, photo_url, available, date, quantity, description, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";

            await db.query(query, [name, value, photo_url, avaiable, date, quantity, description, user_id]);

            res.status(201).json({
                "Message": "Produto inserido com sucesso"
            })
        } catch (error) {
            console.error('Erro na consulta ao banco de dados:', error);

            if (error.code === '23502') {
                // Código de erro '23502' geralmente indica uma violação de NOT NULL (coluna obrigatória)
                res.status(400).json({ error: 'Erro: A coluna: ' + error.column + " é obrigatória" });
            }
            else {
                res.status(500).json({ error: error });
            }
        }
    }

    static async deleteProduct(req, res) {

        try {
            const auth = req.headers['authorization'];
            const user_id = await this.getUserByToken(auth);
            const result = await db.query(`DELETE FROM products where id = '${req.params.id}' and user_id = '${user_id}' `);
            if (result.rowCount == 0) {
                const erro = new Error("sem permissão");
                erro.code = "UN13";
                throw erro;
            }
            res.json({
                msg: "Deletado com sucesso"
            });
        } catch (error) {

            if (error.code == "UN13") {
                res.status(400).json({ error: 'Produto não existente ou você não tem permissão para excluir esse produto' });
            } else {
                console.error('Erro na consulta ao banco de dados:', error);
                res.status(500).json({ error: 'Erro interno no servidor' });
            }

        }
    }

    static newErro(desc, code){
        const erro = new Error(desc);
        erro.code = code;
        return erro;
    }

    static async getUserByToken(auth) {
        const query = `SELECT user_id FROM authorizations where token = '${auth}' limit 1`;
        const user_id = await db.query(query);
        return user_id.rows[0].user_id;
    }
}

module.exports = ProductController;