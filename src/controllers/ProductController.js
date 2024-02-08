const db = require('./../DataBase/db.js');

class ProductController {

    static async getProducts(req, res) {

        const auth = req.headers['authorization'];
        const user_id = await this.getUserByToken(auth);
        res.send("retornando produtos do usuario: " + user_id);
    }

    static async getUserByToken(auth) {
        const query = `SELECT user_id FROM authorizations where token = '${auth}' limit 1`;
        const user_id = await db.query(query);
        return user_id.rows[0].user_id;
    }
}

module.exports = ProductController;