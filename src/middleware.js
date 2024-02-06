
const checkAuthorization = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (auth === process.env.TOKEN) {
        next();
    } else {
        res.status(403).send('Acesso proibido');
    }
};

module.exports = { checkAuthorization };