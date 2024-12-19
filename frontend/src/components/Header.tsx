import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, isLoggedIn, logout } = useAuth();
    console.log(user);
    const navigate = useNavigate();
    const handlLogout = () => {
        logout();
        navigate('/');
    }
    return (
        <header className="flex justify-between p-4 bg-blue-800 text-white">
            <div className="text-4xl uppercase"><a href='/'><strong>Restaurant</strong>&nbsp;<strong className='text-red-600'>Setup</strong></a></div>
            <div>
                {isLoggedIn ? (
                    <>
                        <div className="mb-4 flex justify-end items-center p-2">
                            <span className='pl-2'>Hi {user?.customername} &nbsp; </span>
                            <span>
                                <button
                                    onClick={handlLogout}
                                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Logout

                                </button>
                            </span>
                        </div>


                    </>
                ) : (
                    <div className="space-x-4">
                        <Link to="/login" className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
                            Sign In
                        </Link>
                        <Link to="/signup" className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
