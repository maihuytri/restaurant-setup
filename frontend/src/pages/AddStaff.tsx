import React, { useEffect, useState } from 'react';
import MessageBox from '../components/MessageBox';
import { useAuth } from '../context/AuthContext';
import { roles } from '../Role';
import { User } from '../User';

const AddStaff = ({ selectedUser, closeMenu }: { selectedUser: User | null, closeMenu: () => void }) => {
    const { user } = useAuth();
    const [id, setId] = useState(-1);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [customerName, setCustomername] = useState('');
    const [isShowMessageBoxModalOpen, setIsShowMessageBoxModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [contactTel, setContactTel] = useState('');
    const [isShowErrorMessageBoxModalOpen, setIsShowErrorMessageBoxModalOpen] = useState(false);
    const [role, setRole] = useState('customer');

    useEffect(() => {
        const start = () => {
            if (selectedUser != null) {
                setId(selectedUser.id);
                setUsername(selectedUser.username);
                setCustomername(selectedUser.customerName);
                setContactTel(selectedUser.contactTel);
                setPassword(selectedUser.password);
                setRole(selectedUser.role);
            }
        }

        start();
    }, []);

    const handleClose = () => {
        setIsShowMessageBoxModalOpen(false);
        closeMenu();
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            if (!username) {
                setTitle("Message");
                setMessage("Please enter your name")
                setIsShowErrorMessageBoxModalOpen(true);
                return;
            }

            if (!customerName) {
                setTitle("Message");
                setMessage("Please enter your customer name")
                setIsShowErrorMessageBoxModalOpen(true);
                return;
            }

            if (!password && id == -1) {
                setTitle("Message");
                setMessage("Please enter your password")
                setIsShowErrorMessageBoxModalOpen(true);
                return;
            }

            let res;

            if (id > 0) {
                res = await fetch(`${process.env.REACT_APP_APIURL}/users/${id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
                        body: JSON.stringify({ username, role, customerName, password, contactTel }),
                    });
                const result = await res.json();
                if (result.errorCode == 200) {
                    setTitle("Message");
                    setMessage("You have update customer successfully");
                    setIsShowMessageBoxModalOpen(true);
                } else {
                    setTitle("Message");
                    setMessage(result.message);
                    setIsShowErrorMessageBoxModalOpen(true);
                }
            } else {
                res = await fetch(`${process.env.REACT_APP_APIURL}/users`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
                        body: JSON.stringify({ username, role, customerName, password, contactTel }),
                    });
                const result = await res.json();
                if (result.errorCode == 200) {
                    setTitle("Message");
                    setMessage("You haven created customer successfully");
                    setIsShowMessageBoxModalOpen(true);
                } else {
                    setTitle("Message");
                    setMessage(result.message);
                    setIsShowErrorMessageBoxModalOpen(true);
                }
            }

        } catch (error) {
            setTitle("Message");
            setMessage("You haven't created menu successfully");
            setIsShowErrorMessageBoxModalOpen(true);
        }
    };

    const closeAddUserModal = () => {
        closeMenu();
    };

    const handleChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(e.target.value);
    };
    const handleCloseErrorMessageBox = () => {
        setIsShowErrorMessageBoxModalOpen(false);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Add Customer</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block">Username</label>
                        <div>
                            <input
                                type="text"
                                placeholder="Please enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="block w-full border p-2 rounded"
                            />
                        </div>
                        {!selectedUser && (
                            <>
                                <label className="block">Password</label>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Please enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="block w-full border p-2 rounded"
                                    />
                                </div>
                            </>
                        )}

                        <label className="block">Customer name</label>
                        <div>
                            <input
                                type="text"
                                placeholder="Please enter your customer name"
                                value={customerName}
                                onChange={(e) => setCustomername(e.target.value)}
                                required
                                className="block w-full border p-2 rounded"
                            />
                        </div>
                        <label className="block">Customer phone</label>
                        <div>
                            <input
                                type="text"
                                placeholder="Please enter your customer phone"
                                value={contactTel}
                                onChange={(e) => setContactTel(e.target.value)}
                                required
                                className="block w-full border p-2 rounded"
                            />
                        </div>
                        <label className="block">Role</label>
                        <div>
                            <select value={role} className="border p-2 w-full mt-2" onChange={handleChangeRole}>
                                {roles.map((r, index) =>
                                    <option key={index} value={r.name}>{r.name}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Save
                            </button> &nbsp;
                            <button onClick={closeAddUserModal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Close
                            </button>
                        </div>
                    </form>
                    <div>
                        {isShowMessageBoxModalOpen && (
                            <MessageBox onClose={handleClose} title={title} message={message} />

                        )}
                        {isShowErrorMessageBoxModalOpen && (
                            <MessageBox onClose={handleCloseErrorMessageBox} title={title} message={message} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStaff;
