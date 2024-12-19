import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddMenu from '../pages/AddMenu';
import MessageBox from './MessageBox';
import ConfirmMessageBox from './ConfirmMessageBox';
import { MenuItem } from '../Menu';

const MenuList = () => {
    const { user, isLoggedIn, logout } = useAuth();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
    const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
    const [isShowMessageBoxModalOpen, setIsShowMessageBoxModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

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

            const res = await fetch(`${process.env.REACT_APP_APIURL}/menuItems?${new Date().getMilliseconds()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            const result = await res.json();
            //if (result.errorCode == 200) {
            console.log("data " + result);
            setMenuItems(result);
            //} else {
            //   setMenuItems([]);
            //}
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        refreshData();
    }, []);

    // // Open modal
    const openAddMenuModal = (menu: MenuItem | null) => {
        setSelectedMenu(menu);
        setIsAddMenuModalOpen(true);
    };

    // Close modal
    const closeAddMenuModal = () => {
        setIsAddMenuModalOpen(false);
        refreshData();
    };

    const handlSaveMenu = () => {
        refreshData();
    }

    const handleDeleteMenu = (menu: MenuItem | null) => {
        setSelectedMenu(menu);
        setTitle("Confirm");
        setMessage(`Are you sure do you want to delete this ${selectedMenu?.name} ?`);
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

            const res = await fetch(`${process.env.REACT_APP_APIURL}/menuItems/${selectedMenu?.id}`, {
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
            <h2 className="text-2xl font-bold mb-4">Menus</h2>
            <div className="mb-4">
                <button
                    onClick={() => openAddMenuModal(null)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600">
                    Add Menu
                </button>
            </div>
            <div className="mb-4">
                <ul className="space-y-4">
                    {menuItems.map((item) => (
                        <li key={item.id} className="border p-4 rounded shadow-lg">
                            <h3 className="text-lg font-bold">{item.name}</h3>
                            <p>Category: {item.category}</p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <p>Description: {item.description}</p>
                            <p>
                                <button
                                    onClick={() => openAddMenuModal(item)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                                >
                                    Edit
                                </button> &nbsp;
                                <button
                                    onClick={() => handleDeleteMenu(item)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                                >
                                    Delete
                                </button>
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            {
                isAddMenuModalOpen && (
                    <AddMenu selectedMenu={selectedMenu} closeMenu={closeAddMenuModal} />
                )
            }
            {isShowMessageBoxModalOpen && (
                <ConfirmMessageBox onClose={handleMessageBoxClose} onOk={handleOnOk} title={title} message={message} />
            )}

        </div>
    );
};

export default MenuList;
