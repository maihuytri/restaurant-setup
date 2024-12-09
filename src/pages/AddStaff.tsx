import React, { useState } from 'react';
import MessageBox from '../components/MessageBox';
import { useAuth } from '../context/AuthContext';

const AddStaff = () => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isShowMessageBoxModalOpen, setIsShowMessageBoxModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const handleClose = () => {
        setIsShowMessageBoxModalOpen(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            if (!name) {
                setTitle("Message");
                setMessage("Please enter your name")
                setIsShowMessageBoxModalOpen(true);
                return;
            }

            if (!username) {
                setTitle("Message");
                setMessage("Please enter your username")
                setIsShowMessageBoxModalOpen(true);
                return;
            }

            if (!password) {
                setTitle("Message");
                setMessage("Please enter your password")
                setIsShowMessageBoxModalOpen(true);
                return;
            }

            const res = await fetch(`${process.env.REACT_APP_APIURL}/users`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
                    body: JSON.stringify({ name, role: 'staff', username, phone, email }),
                });

            const result = await res.json();
            setTitle("Message");
            setMessage(result.message)
            setIsShowMessageBoxModalOpen(true);
            if (result.errorCode == 200) {
                setUsername('');
                setPassword('');
                setName('');
            }
        } catch (error) {
            setTitle("Message");
            setMessage("Internal server");
            setIsShowMessageBoxModalOpen(true);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Add Staff</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="block w-full border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Please enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="block w-full border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Please enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full border p-2 rounded"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add Staff
                </button>
            </form>
            <div>
                {isShowMessageBoxModalOpen && (
                    <MessageBox onClose={handleClose} title={title} message={message} />
                )}
            </div>
        </div>
    );
};

export default AddStaff;
