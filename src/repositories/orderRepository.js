const db = require('./../DataBase/db.js');

class orderRepository {

    static async findAllFromUser(user_id) {
        const query = `SELECT * from orders where user_id = '${user_id}'`;
        const rows = await db.query(query);
        return rows;
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

}

module.exports = orderRepository;