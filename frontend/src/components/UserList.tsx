import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../User';
import AddStaff from '../pages/AddStaff';
import ConfirmMessageBox from './ConfirmMessageBox';

const UserList = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
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

            const res = await fetch(`${process.env.REACT_APP_APIURL}/users`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })

            const result = await res.json();
            //if (result.errorCode == 200) {
            console.log("data " + result);
            setUsers(result);
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

    // Open modal
    const openAddUserModal = (user: User | null) => {
        setSelectedUser(user);
        setIsAddUserModalOpen(true);
    };

    // Close modal
    const closeAddUserModal = () => {
        setIsAddUserModalOpen(false);
        refreshData();
    };

    const handlSaveUser = () => {
        refreshData();
    }

    const handleDeleteUser = (u: User | null) => {
        setSelectedUser(u);
        setTitle("Confirm");
        setMessage(`Are you sure do you want to delete this ${u?.customerName} ?`);
        setIsShowMessageBoxModalOpen(true);

    }

    const handleMessageBoxClose = () => {
        setIsShowMessageBoxModalOpen(false);
    }

    const handleOnOk = async () => {
        try {

            if (!selectedUser)
                return;
            console.log(JSON.stringify(selectedUser));
            let token = user?.token;
            if (token == undefined) {
                const stored_state = localStorage.getItem("token");
                if (stored_state) {
                    const o = JSON.parse(stored_state);
                    token = o.token;
                }
            }

            const res = await fetch(`${process.env.REACT_APP_APIURL}/users/${selectedUser?.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            })
            setSelectedUser(null);
            setIsShowMessageBoxModalOpen(false);
            refreshData();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">List of Customers</h2>
            <div className="mb-4">
                <button
                    onClick={() => openAddUserModal(null)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600">
                    Add Customer
                </button>
            </div>
            <ul className="space-y-4">
                {users.map((user) => (
                    <li key={user.id} className="border p-4 rounded shadow-lg">
                        <h2 className="text-lg font-bold">{user.username}</h2>
                        <p>Name: {user.customerName}</p>
                        <p>Phone: {user.contactTel}</p>
                        <p>Role: {user.role}</p>
                        <p>
                            <button
                                onClick={() => openAddUserModal(user)}
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                            >
                                Edit
                            </button> &nbsp;
                            <button
                                onClick={() => handleDeleteUser(user)}
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                            >
                                Delete
                            </button>
                        </p>
                    </li>
                ))}
            </ul>
            {
                isAddUserModalOpen && (
                    <AddStaff selectedUser={selectedUser} closeMenu={closeAddUserModal} />
                )
            }
            {isShowMessageBoxModalOpen && (
                <ConfirmMessageBox onClose={handleMessageBoxClose} onOk={handleOnOk} title={title} message={message} />
            )}
        </div>
    );
};

export default UserList;
