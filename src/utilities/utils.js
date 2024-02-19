class Utils{
    static newErro(desc, code) {
        const erro = new Error(desc);
        erro.code = code;
        return erro;
    }
}


module.exports = Utils;