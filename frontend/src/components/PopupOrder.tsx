import React, { useEffect, useState } from 'react';
import { categoies } from "../Category";
import MessageBox from './MessageBox';
import ConfirmMessageBox from './ConfirmMessageBox';
import { MenuItem } from '../Menu';
import { useAuth } from '../context/AuthContext';

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

export type Status = { name: string };
export const status = [
    { name: 'PENDING' },
    { name: 'IN_PROGRESS' },
    { name: 'COMPLETED' },
    { name: 'CANCELED' }
]

function AddOrder({ selectedItem, selectedOrder, closeOrder }: { selectedItem: MenuItem | null, selectedOrder: Order | null, closeOrder: () => void }) {
    const { user } = useAuth();
    const [customerName, setCustomerName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState<string>("All");
    const [isShowMessageBoxModalOpen, setIsShowMessageBoxModalOpen] = useState(false);
    const [isShowErrorMessageBoxModalOpen, setIsShowErrorMessageBoxModalOpen] = useState(false);
    const [isShowMessageBoxConfirmModalOpen, setIsShowMessageBoxConfirmModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [note, setNote] = useState('');
    const [orerStatus, setOrderStatus] = useState('PENDING');

    useEffect(() => {
        if (user != undefined && selectedOrder == null) {
            setCustomerName(user?.customername);

        } else if (selectedOrder) {
            setCustomerName(selectedOrder.customerName);
            setContactInfo(selectedOrder.contactTel);
            setQuantity(selectedOrder.quantity);
            setNote(selectedOrder.note);
            setOrderStatus(selectedOrder.status);
        }
    }, []);

    const handleOrderSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!customerName) {
            setTitle("Message");
            setMessage("Please enter your name")
            setIsShowMessageBoxModalOpen(true);
            return;
        }

        if (quantity < 0) {
            setTitle("Message");
            setMessage("Please enter quantity")
            setIsShowMessageBoxModalOpen(true);
            return;
        }

        setTitle("Confirm Message");
        setMessage("Are you sure do you want to order?")
        setIsShowMessageBoxConfirmModalOpen(true);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOrderStatus(e.target.value);
    };

    const handleClose = () => {
        setIsShowMessageBoxModalOpen(false);
        closeOrder();
    }

    const handleCloseErrorMessageBox = () => {
        setIsShowErrorMessageBoxModalOpen(false);
    }

    const handleCloseMessageBoxConfirm = () => {
        setIsShowMessageBoxConfirmModalOpen(false);
    }

    const handleOk = async () => {
        setIsShowMessageBoxConfirmModalOpen(false);
        try {

            if (!selectedOrder) {
                const res = await fetch(`${process.env.REACT_APP_APIURL}/orders/create`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
                        body: JSON.stringify({
                            customerName, contactTel: contactInfo, menuItemCount: quantity, note,
                            menuItemRequest: { ...selectedItem }
                        }),
                    });

                const result = await res.json();
                if (result.errorCode == 200) {
                    setTitle("Message");
                    setMessage("You have placed order successfully");
                    setIsShowMessageBoxModalOpen(true);
                } else {
                    setTitle("Message");
                    setMessage(result.message);
                    setIsShowErrorMessageBoxModalOpen(true);
                }
            } else {
                const res = await fetch(`${process.env.REACT_APP_APIURL}/orders/${selectedOrder.id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
                        body: JSON.stringify({
                            customerName, contactTel: contactInfo, menuItemCount: quantity, note, status: orerStatus,
                            menuItemRequest: { ...selectedItem }
                        }),
                    });

                const result = await res.json();
                if (result.errorCode == 200) {
                    setTitle("Message");
                    setMessage("You have updated order successfully");
                    setIsShowMessageBoxModalOpen(true);
                } else {
                    setTitle("Message");
                    setMessage(result.message);
                    setIsShowErrorMessageBoxModalOpen(true);
                }
            }

        } catch (error) {
            setTitle("Message");
            setMessage("The system is busy");
            setIsShowErrorMessageBoxModalOpen(true);
        }
    }

    const closeAddOrderModal = () => {
        closeOrder();
    };

    return (
        <div>
            {selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <form onSubmit={handleOrderSubmit}>
                            <h2 className="text-2xl font-bold mb-4">Order: {selectedItem.name}</h2>
                            <label className="block mb-2">
                                <span className="text-gray-700">Customer Name</span>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="block w-full border p-2 rounded"
                                />
                            </label>
                            <label className="block mb-2">
                                <span className="text-gray-700">Contact Info</span>
                                <input
                                    type="text"
                                    value={contactInfo}
                                    onChange={(e) => setContactInfo(e.target.value)}
                                    className="block w-full border p-2 rounded"
                                />
                            </label>
                            <label className="block mb-2">
                                <span className="text-gray-700">Quantity</span>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    min="1"
                                    required
                                    className="block w-full border p-2 rounded"
                                />
                            </label>
                            <label className="block mb-2">
                                <span className="text-gray-700">Note</span>
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="block w-full border p-2 rounded"
                                />
                            </label>
                            {selectedOrder && user?.role == "manager" && (
                                <>
                                    <label className="block mb-2">
                                        <span className="text-gray-700">Status</span>
                                        <select value={orerStatus} className="border p-2 w-full mt-2" onChange={handleStatusChange}>
                                            {status.map((s, index) =>
                                                <option key={index} value={s.name}>{s.name}</option>
                                            )}
                                        </select>
                                    </label>
                                </>
                            )}
                            <button
                                onClick={closeOrder}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Cancel
                            </button>
                            &nbsp;
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Order
                            </button>
                        </form>
                    </div>
                </div>
            )
            }
            <div>
                {isShowMessageBoxModalOpen && (
                    <MessageBox onClose={handleClose} title={title} message={message} />
                )}
                {isShowErrorMessageBoxModalOpen && (
                    <MessageBox onClose={handleCloseErrorMessageBox} title={title} message={message} />
                )}
                {isShowMessageBoxConfirmModalOpen && (
                    <ConfirmMessageBox onOk={handleOk} onClose={handleCloseMessageBoxConfirm} title={title} message={message} />
                )}
            </div>

        </div >
    );
};

export default AddOrder;
