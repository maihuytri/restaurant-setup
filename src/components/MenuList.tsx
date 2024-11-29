import React, { useEffect, useState } from 'react';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
}

const MenuList = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/menu-items')
            .then((response) => response.json())
            .then((data) => setMenuItems(data))
            .catch((error) => console.error('Error fetching menu items:', error));
    }, []);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
            <ul className="space-y-4">
                {menuItems.map((item) => (
                    <li key={item.id} className="border p-4 rounded shadow-lg">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <p>{item.description}</p>
                        <p>Category: {item.category}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MenuList;
