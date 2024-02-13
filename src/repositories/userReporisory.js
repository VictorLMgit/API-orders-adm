const db = require('./../DataBase/db.js');

class userRepository {

    static async findUserByToken(token){
        const query = `SELECT user_id FROM authorizations where token = '${token}' limit 1`;
        const user_id = await db.query(query);
        return user_id.rows[0].user_id;
    }

}

module.exports = userRepository;