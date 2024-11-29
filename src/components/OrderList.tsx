import React, { useEffect, useState } from 'react';

interface Order {
    id: number;
    userId: number;
    menuItemId: number;
    quantity: number;
    status: string; // 'pending', 'completed', 'cancelled'
}

const OrderList = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // fetch('http://localhost:8080/api/orders')
        //     .then((response) => response.json())
        //     .then((data) => setOrders(data))
        //     .catch((error) => console.error('Error fetching orders:', error));

    }, []);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Orders</h2>
            <ul className="space-y-4">
                {orders.map((order) => (
                    <li key={order.id} className="border p-4 rounded shadow-lg">
                        <p>
                            <strong>Order ID:</strong> {order.id}
                        </p>
                        <p>
                            <strong>User ID:</strong> {order.userId}
                        </p>
                        <p>
                            <strong>Menu Item ID:</strong> {order.menuItemId}
                        </p>
                        <p>
                            <strong>Quantity:</strong> {order.quantity}
                        </p>
                        <p>
                            <strong>Status:</strong> {order.status}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
