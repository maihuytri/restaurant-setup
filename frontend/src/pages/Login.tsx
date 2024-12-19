import { useState } from 'react';
import { useAuth, Role } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import { env } from 'process';

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isShowMessageBoxModalOpen, setIsShowMessageBoxModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const handleClose = () => {
        setIsShowMessageBoxModalOpen(false);
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
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

            const res = await fetch(`${process.env.REACT_APP_APIURL}/auth/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username, password: password })
                });

            const result = await res.json();
            // console.log(result.data.token);
            // console.log(JSON.stringify(result));
            if (result.errorCode == 200) {

                login(username, result.data.token, result.data.role, result.data.customername);
                navigate('/');
            } else {
                setTitle("Message");
                setMessage(result.message)
                setIsShowMessageBoxModalOpen(true);
            }
        } catch (error) {
            setTitle("Message");
            setMessage("Internal server");
            setIsShowMessageBoxModalOpen(true);
        }

    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Login</h1>
            <form onSubmit={handleLogin} className="mt-4">
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
                    Login
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

export default Login;
