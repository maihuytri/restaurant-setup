import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import MessageBox from "../components/MessageBox";
import { categoies } from "../Category";

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
}

const AddMenu = ({ selectedMenu, closeMenu }: { selectedMenu: MenuItem | null, closeMenu: () => void }) => {
    const { user } = useAuth();
    const [id, setId] = useState(-1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('0');
    const [stock, setStock] = useState(1);
    const [category, setCategory] = useState('');
    const [isShowMessageBoxModalOpen, setIsShowMessageBoxModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isShowErrorMessageBoxModalOpen, setIsShowErrorMessageBoxModalOpen] = useState(false);

    const handleClose = () => {
        setIsShowMessageBoxModalOpen(false);
        closeMenu();
    }

    useEffect(() => {

        const start = () => {
            console.log("Menu " + JSON.stringify(selectedMenu));
            if (selectedMenu != null) {
                setId(selectedMenu.id);
                setName(selectedMenu.name);
                setDescription(selectedMenu.description);
                setPrice(selectedMenu.price.toString());
                setCategory(selectedMenu.category);
                setStock(selectedMenu.stock);
            }
        }

        start();
    }, []);

    const isDouble = (value: string): boolean => {
        return !isNaN(Number(value)) && value.trim() !== '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!name) {
                setTitle("Message");
                setMessage("Please enter your menu name")
                setIsShowErrorMessageBoxModalOpen(true);
                return;
            }

            if (!price) {
                setTitle("Message");
                setMessage("Please enter your price")
                setIsShowErrorMessageBoxModalOpen(true);
                return;
            }

            if (!isDouble(price)) {
                setTitle("Message");
                setMessage("Please enter your price as number")
                setIsShowErrorMessageBoxModalOpen(true);
                return;
            }

            if (!stock) {
                setTitle("Message");
                setMessage("Please enter your stock")
                setIsShowErrorMessageBoxModalOpen(true);
                return;
            }

            let res;
            if (id > 0) {
                res = await fetch(`${process.env.REACT_APP_APIURL}/menuItems/${id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
                        body: JSON.stringify({ name, description, category, price, stock }),
                    });
                const result = await res.json();
                setTitle("Message");
                setMessage("You have update menu successfully");
                setIsShowMessageBoxModalOpen(true);
            } else {
                res = await fetch(`${process.env.REACT_APP_APIURL}/menuItems/create`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
                        body: JSON.stringify({ name, description, category, price, stock }),
                    });
                const result = await res.json();
                setTitle("Message");
                setMessage("You have created menu successfully");
                setIsShowMessageBoxModalOpen(true);
            }
        } catch (error) {
            console.log(error);

            setTitle("Message");
            setMessage("You haven't created menu successfully");
            setIsShowErrorMessageBoxModalOpen(true);
        }
    };

    const closeAddMenuModal = () => {
        closeMenu();
    };

    const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
    };
    const handleCloseErrorMessageBox = () => {
        setIsShowErrorMessageBoxModalOpen(false);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <div className="w-full container mx-auto p-4">
                    <div className="p-4">
                        <h1 className="text-2xl font-bold mb-4">Menu</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">Name</label>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Please enter your menu name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="block w-full border p-2 rounded"
                                />
                            </div>
                            <label className="block">Category</label>
                            <div>
                                <select value={category} className="border p-2 w-full mt-2" onChange={handleChangeCategory}>
                                    {categoies.map((c, index) =>
                                        <option key={index} value={c.title}>{c.title}</option>
                                    )}
                                </select>
                            </div>
                            <label className="block">Price</label>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Please enter your price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    className="block w-full border p-2 rounded"
                                />
                            </div>
                            <label className="block">Stock</label>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Please enter your stock"
                                    value={stock}
                                    onChange={(e) => setStock(Number(e.target.value))}
                                    required
                                    className="block w-full border p-2 rounded"
                                />
                            </div>
                            <label className="block">Description</label>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Please enter your description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="block w-full border p-2 rounded"
                                />
                            </div>
                            <div>
                                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                    Save
                                </button> &nbsp;
                                <button onClick={closeAddMenuModal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
        </div>
    );
};

export default AddMenu;
