const orderRepository = require("./../repositories/orderRepository.js");
const userRepository = require("./../repositories/userReporisory.js");

class ReportController{

    static async geralReport(req, res){
        try{
            const auth = req.headers['authorization'];
            const user_id = await userRepository.findUserByToken(auth);
            const report = await orderRepository.countOrdersFromUser(user_id).countOrders();
            res.status(200).json(report); 
        } catch (error){
            res.status(500).json({
                erro: error
            });
        }
    }
    static async finishedOrders(req, res){
        try{
            const auth = req.headers['authorization'];
            const user_id = await userRepository.findUserByToken(auth);
            const report = await orderRepository.countOrdersFromUser(user_id).finishedOrders();
            res.status(200).json(report); 
        } catch (error){
            res.status(500).json({
                erro: error
            });
        }
    }
    static async inProgressOrders(req, res){
        try{
            const auth = req.headers['authorization'];
            const user_id = await userRepository.findUserByToken(auth);
            const report = await orderRepository.countOrdersFromUser(user_id).inProgressOrders();
            res.status(200).json(report); 
        } catch (error){
            res.status(500).json({
                erro: error
            });
        }
    }


}

module.exports = ReportController;