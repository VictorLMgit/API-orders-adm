const db = require('./../DataBase/db.js');
const { format, addHours } = require('date-fns');
const crypto = require('crypto');
const Commom = require("../utilities/utils.js");
class AuthController {

    static async generateToken(req, res) {

        const login = req.body.login
        const password = req.body.password

        try {
            const query = `SELECT id, password, salt FROM users where login = '${login}' limit 1`;
            const user = await db.query(query);

            if (user.rowCount == 0) throw Commom.newErro("Usuario inválido", "UI13");

            const hashedPassword = user.rows[0].password;
            const salt = user.rows[0].salt;
            
            const compare = await this.comparePassword(password, hashedPassword, salt);
            if (!compare) throw Commom.newErro("Usuario inválido", "UI13");


            const token = crypto.randomBytes(Math.ceil(60 / 2))
                .toString('hex')
                .slice(0, 60);
            const user_id = user.rows[0].id;
            const currentDate = new Date();
            const created_at = format(currentDate, 'yyyy-MM-dd HH:mm:ss')
            const expiresDate = addHours(currentDate, 5);
            const expires_at = format(expiresDate, 'yyyy-MM-dd HH:mm:ss');
            const queryInsert = `INSERT INTO authorizations (token, user_id, created_at , expires_at) VALUES ('${token}', '${user_id}', '${created_at}' , '${expires_at}' )`;
            await db.query(queryInsert);

            res.status(201).json(
                {
                    token: token,
                    created_at: created_at,
                    expires_at: expires_at,
                    user_id: user_id,
                }
            );
        } catch (error) {
            if (error.code == 'UI13') {
                res.status(404).json({ error: "Usuario não existente" });
            } else {
                res.status(500).json({ error: error });
            }
        }

    }

    static async comparePassword(password, hashedPasswordDB, salt) {
        const hashedPasswordUser = crypto.createHmac('sha256', salt)
        .update(password)
        .digest('hex');

        console.log(hashedPasswordUser == hashedPasswordDB);
        return hashedPasswordUser == hashedPasswordDB;
    }

   

}

module.exports = AuthController;