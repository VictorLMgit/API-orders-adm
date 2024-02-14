const db = require('./../DataBase/db.js');

class orderRepository {

    static findFromUser(user_id) {
        return {
            all: async (order_by = 'desc')=>{
                const query = `SELECT * from orders where user_id = '${user_id}' order by id ${order_by}`;
                const rows = await db.query(query);
                return rows;
            },
            where: async (conditions, order_by = 'desc') => {
                const query = `SELECT * from orders where user_id = '${user_id}' and ${conditions} order by id ${order_by}`;
                console.log(query);
                const rows = await db.query(query);
                return rows;
            }
        };
    }
    static async findByIdFromUser(order_id, user_id) {
        const query = `SELECT * from orders where user_id = '${user_id}' and id = ${order_id}`;
        const row = await db.query(query);
        return row;
    }
    static async deleteOrderFromUser(order_id, user_id) {
        const result = await db.query(`DELETE FROM orders where id = '${order_id}' and user_id = '${user_id}' `);
        return result;
    }
    static async createOrder(user_id, { order_data, date, available }) {
        const query = "insert into orders (order_data, date, available, user_id) VALUES ($1, $2, $3, $4)";
        await db.query(query, [order_data, date, available, user_id]);
    }

    static async updateOrder(orderId, updatedData) {
        const updateFields = Object.keys(updatedData).map((key, index) => {
            return `${key} = $${index + 1}`;
        });

        const updateQuery = `
        UPDATE orders
        SET ${updateFields.join(',')}
        WHERE id = $${Object.keys(updatedData).length + 1}
        `;
        const values = Object.values(updatedData);
        values.push(orderId);

        const result = await db.query(updateQuery, values);
        return result;
    }

    static countOrdersFromUser(user_id){
        var finishedOrders = async () => {
            const orders = await this.findFromUser(user_id).where("available = false");
            return {
                totalFinishedOrders:orders.rowCount,
                finishedOrders:orders.rows
            };
        }

        var inProgressOrders = async () => {
            const orders = await this.findFromUser(user_id).where("available = true");
            return {
                totalInProgressOrders:orders.rowCount,
                inProgressOrders:orders.rows
            };
        }

        var countOrders = async () => {
            const orders = await this.findFromUser(user_id).all();
            const ordersInProgress = ((orders.rows).filter(el => el['available'] = true));
            return {
                totalOrders:orders.rowCount,
                totalInProgressOrders:ordersInProgress.length,
                ordersInProgress:ordersInProgress
            };
        }
        
        return {
            finishedOrders:finishedOrders,
            inProgressOrders:inProgressOrders,
            countOrders:countOrders,
        }

    }

}

module.exports = orderRepository;