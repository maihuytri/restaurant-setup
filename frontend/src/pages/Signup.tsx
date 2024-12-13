import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isShowErrorMessageBoxModalOpen, setIsShowErrorMessageBoxModalOpen] = useState(false);
    const [isShowMessageBox, setIsShowMessageBox] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleCloseErrorMessageBox = () => {
        setIsShowErrorMessageBoxModalOpen(false);
    }

    const handleCloseMessageBox = () => {
        setIsShowMessageBox(false);
        navigate('/login');
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("signup");

            if (!username) {
                setTitle("Message");
                setMessage("Please enter your username")
                setIsShowErrorMessageBoxModalOpen(true);
                return;
            }

            if (!password) {
                setTitle("Message");
                setMessage("Please enter your password")
                setIsShowErrorMessageBoxModalOpen(true);
                return;
            }

            const res = await fetch(`${process.env.REACT_APP_APIURL}/auth/signup`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username, password: password })
                });

            const result = await res.json();
            if (result.errorCode == 200) {
                setTitle("Message");
                setMessage(result.message)
                setIsShowMessageBox(true);
            } else {
                setTitle("Message");
                setMessage(result.message)
                setIsShowErrorMessageBoxModalOpen(true);
            }
        } catch (error) {
            console.log("error " + error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Sign Up</h1>
            <form onSubmit={handleSignup} className="mt-4">
                <div className="mb-4">
                    <label className="block">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Sign Up
                </button>
            </form>
            <div>
                {isShowErrorMessageBoxModalOpen && (
                    <MessageBox onClose={handleCloseErrorMessageBox} title={title} message={message} />
                )}

                {isShowMessageBox && (
                    <MessageBox onClose={handleCloseMessageBox} title={title} message={message} />
                )}
            </div>
        </div>
    );
};

export default Signup;
