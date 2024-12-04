import React, { useEffect, useState } from 'react';
import { categoies } from "../Category";
import AddOrder from './PopupOrder';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: Number;
    category: string
}

const OrderMenu = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [category, setCategory] = useState<string>("All");
    const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);

    useEffect(() => {
        // fetch('http://localhost:8080/api/menu-items')
        //     .then((response) => response.json())
        //     .then((data) => setMenuItems(data))
        //     .catch((error) => console.error('Error fetching menu items:', error));
        const defaultMenuItems: Array<MenuItem> = [
            { id: 1, name: "Pizza", description: "Delicious cheese pizza", category: "Main Course", price: 10.99 },
            { id: 2, name: "Burger", description: "Beef burger with fries", category: "Fast Food", price: 8.99 },
            { id: 3, name: "Pasta", description: "Creamy Alfredo pasta", category: "Main Course", price: 9.99 },
            { id: 4, name: "Ice Cream", description: "Vanilla ice cream", category: "Dessert", price: 3.99 }
        ];

        console.log("category " + category);
        setMenuItems(category == "All" ? defaultMenuItems : defaultMenuItems.filter(item => item.category == category));
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
                            {categoies.map((category, index) =>
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
