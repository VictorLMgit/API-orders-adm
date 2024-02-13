const orderRepository = require("./../repositories/orderRepository.js");
const userRepository = require("./../repositories/userReporisory.js");

class OrderController {

    static async getOrder(req, res) {

        try {
            const auth = req.headers['authorization'];
            const user_id = await userRepository.findUserByToken(auth);
            
            const order = await orderRepository.findByIdFromUser(req.params.id, user_id);
            if (order.rowCount == 0) throw this.newErro("nao encontrado", "NE13");
            res.status(200).json(order.rows);
        } catch (error) {
            if (error.code == "NE13") {
                res.status(404).json({
                    message: "Order nao encontrada"
                });
            } else {
                res.status(500).json({
                    erro: error
                });
            }
        }
    }

    static async getOrders(req, res) {

        try {
            const auth = req.headers['authorization'];
            const user_id = await userRepository.findUserByToken(auth);
            const orders = await orderRepository.findAllFromUser(user_id);
            res.status(200).json(orders.rows);
        } catch (error) {
            res.status(500).json({
                erro: error
            });
        }
    }

    static async deleteOrder(req, res) {

        try {
            const auth = req.headers['authorization'];
            const user_id = await userRepository.findUserByToken(auth);
            const result = await orderRepository.deleteOrderFromUser(req.params.id, user_id);
            if (result.rowCount == 0) throw this.newErro("Sem permissão", "UN13");
            res.json({
                msg: "Deletado com sucesso"
            });
        } catch (error) {

            if (error.code == "UN13") {
                res.status(400).json({ error: 'order não existente ou você não tem permissão para excluir esse produto' });
            } else {
                console.error('Erro na consulta ao banco de dados:', error);
                res.status(500).json({ error: 'Erro interno no servidor' });
            }

        }
    }

    static async postOrder(req, res) {

        try {
            const auth = req.headers['authorization'];
            const user_id = await userRepository.findUserByToken(auth);       
            await orderRepository.createOrder(user_id, req.body);
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

    static async updateOrder(req, res) {
        
        try {
            const auth = req.headers['authorization'];
            const user_id = await userRepository.findUserByToken(auth);
            const orderId = req.params.id;
            const verify = await orderRepository.findByIdFromUser(orderId, user_id);
            if (verify.rowCount == 0)  throw this.newErro("Sem permissão", "UN13");

            const updatedData = req.body;

            if ( updatedData.user_id != user_id && updatedData.user_id != null ) throw this.newErro("invalid argument", "IA13");
            await orderRepository.updateOrder(orderId, updatedData);
            res.json({
                msg: `Order com ID ${orderId} atualizado com sucesso!`
            });
        } catch (error) {
            if (error.code == "UN13") {
                res.status(403).json({ error: 'Order não existente ou você não tem permissão para atualizar esse produto' });
            } else if (error.code == "IA13") {
                res.status(400).json({ error: 'user id nao pode ser alterado' });
            } else {
                console.error('Erro na consulta ao banco de dados:', error);
                res.status(500).json({ error: 'Erro interno no servidor' });
            }
        }
    }

    static newErro(desc, code){
        const erro = new Error(desc);
        erro.code = code;
        return erro;
    }
}

module.exports = OrderController;