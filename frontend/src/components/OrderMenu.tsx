import React, { useEffect, useState } from 'react';
import { categoies, searchCategories } from "../Category";
import AddOrder from './PopupOrder';
import { useAuth } from '../context/AuthContext';
import { MenuItem } from '../Menu';

const OrderMenu = () => {
    const { user, isLoggedIn, logout } = useAuth();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [category, setCategory] = useState<string>("All");
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

            const res = await fetch(`${process.env.REACT_APP_APIURL}/menuItems?category=${category}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            const result = await res.json();
            console.log("data " + result);
            setMenuItems(result);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        refreshData();
    }, [category]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
    };

    // // Open modal
    // Open modal for viewing a policy
    const openAddOrderModal = (selectedItem: MenuItem | null) => {
        console.log("selected Item " + selectedItem);
        setSelectedItem(selectedItem);
        setIsAddOrderModalOpen(true);
    };


    // Close modal
    const closeAddOrderModal = () => {
        setIsAddOrderModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Order Menu</h1><div className="space-y-4">
                <div className="mb-4 flex justify-end items-center p-2">
                    <span className='pl-2'>Category &nbsp;&nbsp;</span>
                    <span>
                        <select className="border p-2 w-full mt-2" onChange={handleCategoryChange}>
                            {searchCategories.map((category, index) =>
                                <option key={index} value={category.title}>{category.title}</option>
                            )}
                        </select>
                    </span>
                </div>
            </div>


            <ul className="space-y-4">
                {menuItems.map((item) => (
                    <li
                        key={item.id}
                        className="border p-4 rounded shadow-lg flex justify-between"
                    >
                        <div>
                            <h2 className="text-lg font-bold">{item.name}</h2>
                            <p>{item.description}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={() => openAddOrderModal(item)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Order
                        </button>
                    </li>
                ))}
            </ul>

            {isAddOrderModalOpen && selectedItem && (
                <AddOrder selectedItem={selectedItem} closeOrder={closeAddOrderModal}></AddOrder>
            )}
        </div>
    );
};

export default OrderMenu;
