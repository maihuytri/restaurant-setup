import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MenuItem } from '../Menu';
import AddOrder from './PopupOrder';
import ConfirmMessageBox from './ConfirmMessageBox';
import { roles } from '../Role';

interface Order {
    id: number;
    customerName: string;
    contactTel: string;
    orderDate: string;
    note: string;
    quantity: number;
    menuItem: MenuItem;
    totalPrice: number;
    menuItemCount: Number;
    status: string; // 'pending', 'completed', 'cancelled'
}

const OrderList = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isShowMessageBoxModalOpen, setIsShowMessageBoxModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);

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


    // // Open modal
    const openAddOrderModal = (order: Order | null) => {
        setSelectedOrder(order);
        setIsAddOrderModalOpen(true);
    };

    // Close modal
    const closeOrderModal = () => {
        setIsAddOrderModalOpen(false);
        refreshData();
    };

    const handleDeleteMenu = (order: Order | null) => {
        setSelectedOrder(order);
        setTitle("Confirm");
        setMessage(`Are you sure do you want to delete this ${order?.customerName} ?`);
        setIsShowMessageBoxModalOpen(true);

    }

    const handleMessageBoxClose = () => {
        setIsShowMessageBoxModalOpen(false);
    }

    const handleOnOk = async () => {
        try {

            let token = user?.token;
            if (token == undefined) {
                const stored_state = localStorage.getItem("token");
                if (stored_state) {
                    const o = JSON.parse(stored_state);
                    token = o.token;
                }
            }

            const res = await fetch(`${process.env.REACT_APP_APIURL}/orders/${selectedOrder?.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })
            setIsShowMessageBoxModalOpen(false);
            refreshData();
        } catch (error) {
            console.log(error);
        }
    }


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
                            <strong>Total Price:</strong> ${order.totalPrice}
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
                        <p>
                            {(user != null && user?.role == 'customer' && order.status == 'PENDING') && (
                                <button
                                    onClick={() => openAddOrderModal(order)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                                >
                                    Edit
                                </button>)}
                            {(user != null && user?.role == 'manager' && (order.status == 'PENDING' || order.status == 'IN_PROGRESS')) && (
                                <button
                                    onClick={() => openAddOrderModal(order)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                                >
                                    Edit
                                </button>)} &nbsp;
                            {(user != null && user?.role == 'customer' && order.status == 'PENDING') && (
                                <button
                                    onClick={() => handleDeleteMenu(order)}
                                    className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
                                >
                                    Cancel
                                </button>
                            )}
                        </p>
                    </li>
                ))}
            </ul>
            {isAddOrderModalOpen && selectedOrder && (
                <AddOrder selectedItem={selectedOrder.menuItem} selectedOrder={selectedOrder} closeOrder={closeOrderModal}></AddOrder>
            )}
            {isShowMessageBoxModalOpen && (
                <ConfirmMessageBox onClose={handleMessageBoxClose} onOk={handleOnOk} title={title} message={message} />
            )}
        </div>
    );
};

export default OrderList;
