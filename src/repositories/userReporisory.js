const db = require('./../DataBase/db.js');
const crypto = require('crypto');
const { format } = require('date-fns');
class userRepository {

    static async findUserByToken(token){
        const query = `SELECT user_id FROM authorizations where token = '${token}' limit 1`;
        const user_id = await db.query(query);
        return user_id.rows[0].user_id;
    }

    static async create({ name, login, password, isactive, permissions}){
        const verify = await db.query("SELECT * FROM users where login = '" + login + "' limit 1");
        const currentDate = new Date();
        const created_at = format(currentDate, 'yyyy-MM-dd HH:mm:ss')
        if (verify.rowCount > 0) {
            const erro = new Error("Login ja existente");
            erro.code = "UE13";
            throw erro;
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword  = crypto.createHmac('sha256', salt).update(password).digest('hex');

        const query = "insert into users (name, login, password, isactive, created_at, permissions, salt) VALUES ($1, $2, $3, $4, $5, $6, $7)";

        await db.query(query, [name, login, hashedPassword, isactive, created_at, permissions, salt]);
    }

}

module.exports = userRepository;