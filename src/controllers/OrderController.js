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

    static async getUserByToken(auth) {
        const query = `SELECT user_id FROM authorizations where token = '${auth}' limit 1`;
        const user_id = await db.query(query);
        return user_id.rows[0].user_id;
    }
}

module.exports = OrderController;