import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MenuItem } from '../Menu';

interface Order {
    id: number;
    customerName: string;
    contactTel: string;
    orderDate: string;
    note: string;
    quantity: number;
    menuItem: MenuItem;
    totalPrice: Number;
    menuItemCount: Number;
    status: string; // 'pending', 'completed', 'cancelled'
}

const OrderList = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    console.log("Order List");
    const refreshData = async () => {
        try {

            let token = user?.token;
            if (token == undefined) {
                const stored_state = localStorage.getItem("token");
                if (stored_state) {
                    const o = JSON.parse(stored_state);
                    token = o.token;
                }
            }

            const res = await fetch(`${process.env.REACT_APP_APIURL}/orders?${new Date().getMilliseconds()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            const result = await res.json();
            setOrders(result);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">View Orders</h2>
            <ul className="space-y-4">
                {orders.map((order) => (
                    <li key={order.id} className="border p-4 rounded shadow-lg">
                        <p>
                            <strong>Order ID:</strong> {order.id}
                        </p>
                        <p>
                            <strong>Menu name:</strong> {order.menuItem.name}
                        </p>
                        <p>
                            <strong>Price:</strong> ${order.menuItem.price}
                        </p>
                        <p>
                            <strong>Quantity:</strong> {"" + order.quantity}
                        </p>
                        <p>
                            <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
                        </p>
                        <p>
                            <strong>Customer name:</strong> {order.customerName}
                        </p>
                        <p>
                            <strong>Contact info:</strong> {order.contactTel}
                        </p>
                        <p>
                            <strong>Note:</strong> {order.note}
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
