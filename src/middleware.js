const db = require('./DataBase/db.js');
const Utils = require("./utilities/utils.js");
class Middlewares {

    static async checkAuthorization(req, res, next) {
        try {
            const auth = req.headers['authorization'];

            if (auth == "" || auth == null) throw Utils.newErro("Token inválido", "TI14");

            const query = `SELECT * FROM authorizations where token = '${auth}' limit 1`;
            const tokenInfo = await db.query(query);

            if (tokenInfo.rowCount == 0) throw Utils.newErro("Token inválido", "TI13");

            const currentDate = new Date();
            const expiresDate = new Date(tokenInfo.rows[0].expires_at);

            if (currentDate > expiresDate) {
                const erro = new Error("Token expirado");
                erro.code = "TE13";
                throw erro;
            }

            next();

        } catch (error) {
            if (error.code == "TI13") {
                res.status(401).json({ error: "Token Inválido" });
            } else if (error.code == "TE13") {
                res.status(401).json({ error: "Token Expirado" });
            } else if (error.code == "TI14") {
                res.status(401).json({ error: "Insira um token" });
            }
        }

    }
}

module.exports = Middlewares;