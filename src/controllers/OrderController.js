const db = require('./../DataBase/db.js');


class OrderController {

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

    static async getUserByToken(auth) {
        const query = `SELECT user_id FROM authorizations where token = '${auth}' limit 1`;
        const user_id = await db.query(query);
        return user_id.rows[0].user_id;
    }
}

module.exports = OrderController;