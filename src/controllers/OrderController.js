const db = require('./../DataBase/db.js');


class OrderController {

    static async getOrder(req, res) {

        try {
            const auth = req.headers['authorization'];
            const user_id = await this.getUserByToken(auth);
            const query = `SELECT * from orders where user_id = '${user_id}' and id = ${req.params.id}`;
            const order = await db.query(query);
            res.status(200).json(order.rows);
        } catch (error) {
            res.status(500).json({
                erro: error
            });
        }
    }

    static async getOrders(req, res) {

        try {
            const auth = req.headers['authorization'];
            const user_id = await this.getUserByToken(auth);
            const query = `SELECT * from orders where user_id = '${user_id}'`;
            const orders = await db.query(query);
            res.status(200).json(orders.rows);
        } catch (error) {
            res.status(500).json({
                erro: error
            });
        }
    }

    static async deleteOrder(req, res) {

        try {
            const auth = req.headers['authorization'];
            const user_id = await this.getUserByToken(auth);
            const result = await db.query(`DELETE FROM orders where id = '${req.params.id}' and user_id = '${user_id}' `);
            if (result.rowCount == 0) throw this.newErro("Sem permissão", "UN13");
            res.json({
                msg: "Deletado com sucesso"
            });
        } catch (error) {

            if (error.code == "UN13") {
                res.status(400).json({ error: 'order não existente ou você não tem permissão para excluir esse produto' });
            } else {
                console.error('Erro na consulta ao banco de dados:', error);
                res.status(500).json({ error: 'Erro interno no servidor' });
            }

        }
    }

    static async postOrder(req, res) {

        try {
            const auth = req.headers['authorization'];
            const user_id = await this.getUserByToken(auth);
            const { order_data, date, available} = req.body;

            const query = "insert into orders (order_data, date, available, user_id) VALUES ($1, $2, $3, $4)";

            await db.query(query, [order_data, date, available, user_id]);

            res.status(201).json({
                "Message": "order inserida com sucesso"
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

    static async updateOrder(req, res) {
        
        try {
            const auth = req.headers['authorization'];
            const user_id = await this.getUserByToken(auth);
            const orderId = req.params.id;

            const q = `SELECT id FROM orders WHERE id = '${orderId}' and user_id = '${user_id}'`;
            const verify = await db.query(q);
            if (verify.rowCount == 0)  throw this.newErro("Sem permissão", "UN13");

            const updatedData = req.body;

            if ( updatedData.user_id != user_id && updatedData.user_id != null ) throw this.newErro("invalid argument", "IA13");

            const updateFields = Object.keys(updatedData).map((key, index) => {
                return `${key} = $${index + 1}`;
            });

            const updateQuery = `
            UPDATE orders
            SET ${updateFields.join(',')}
            WHERE id = $${Object.keys(updatedData).length + 1}
            `;
            const values = Object.values(updatedData);
            values.push(orderId);

            const result = await db.query(updateQuery, values);
            res.json({
                msg: `Order com ID ${orderId} atualizado com sucesso!`
            });
        } catch (error) {
            if (error.code == "UN13") {
                res.status(403).json({ error: 'Order não existente ou você não tem permissão para atualizar esse produto' });
            } else if (error.code == "IA13") {
                res.status(400).json({ error: 'user id nao pode ser alterado' });
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

module.exports = OrderController;