const db = require('./../DataBase/db.js');
const crypto = require('crypto');
const { format, addHours } = require('date-fns');

class AuthController {

    static async generateToken(req, res) {

        const login = req.body.login
        const password = req.body.password

        try {
            const query = `SELECT id FROM users where login = '${login}' and password = '${password}' limit 1`;
            const user = await db.query(query);

            if (user.rowCount == 0) {
                const erro = new Error("Usuario inválido");
                erro.code = "UI13";
                throw erro;
            }
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
                res.status(400).json({ error: "Usuario não existente" });
            } else {
                res.status(500).json({ error: error });
            }
        }

    }

}

module.exports = AuthController;