import React, { useEffect, useState } from 'react';
import { categoies } from "../Category";

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
    const [customerName, setCustomerName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState<string>("-1");


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

    const handleOrderSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedItem) {
            alert('Please select a menu item to order!');
            return;
        }

        const order = {
            customerName,
            contactInfo,
            menuItemId: selectedItem.id,
            quantity,
        };

        fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Order placed successfully!');
                    // Reset form
                    setSelectedItem(null);
                    setCustomerName('');
                    setContactInfo('');
                    setQuantity(1);
                } else {
                    alert('Failed to place the order.');
                }
            })
            .catch((error) => console.error('Error placing order:', error));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
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
                            onClick={() => setSelectedItem(item)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Order
                        </button>
                    </li>
                ))}
            </ul>

            {selectedItem && (
                <form
                    onSubmit={handleOrderSubmit}
                    className="mt-8 border p-4 rounded shadow-lg"
                >
                    <h2 className="text-2xl font-bold mb-4">Order: {selectedItem.name}</h2>
                    <label className="block mb-2">
                        <span className="text-gray-700">Customer Name</span>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                            className="block w-full border p-2 rounded"
                        />
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700">Contact Info</span>
                        <input
                            type="text"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            required
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
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Submit Order
                    </button>
                </form>
            )}
        </div>
    );
};

export default OrderMenu;
