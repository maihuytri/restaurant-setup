import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LeftMenu = () => {
    const { role } = useAuth();

    if (!role) return null;

    // Define menu items based on roles
    const menuItems: Record<string, { label: string; path: string }[]> = {
        manager: [
            { label: 'Add Menu Item', path: '/add-menu' },
            { label: 'Add Staff', path: '/add-staff' },
            { label: 'View Orders', path: '/orders' },
            { label: 'Customer List', path: '/customers' },
        ],
        staff: [
            { label: 'View Orders', path: '/orders' },
            { label: 'Customer List', path: '/customers' },
        ],
        customer: [
            { label: 'View Orders', path: '/orders' },
            { label: 'Customer List', path: '/customers' },
        ],
    };

    return (
        <div className="w-64 bg-gray-100 h-screen p-4">
            <h2 className="text-xl font-bold mb-4">{role.charAt(0).toUpperCase() + role.slice(1)} Menu</h2>
            <ul className="space-y-2">
                {menuItems[role]?.map((item, index) => (
                    <li key={index}>
                        <Link to={item.path} className="text-blue-500 hover:underline">
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeftMenu;
