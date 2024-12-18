import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MessageBox from "../components/MessageBox";

const AddMenu = () => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [isShowMessageBoxModalOpen, setIsShowMessageBoxModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

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

            if (!price) {
                setTitle("Message");
                setMessage("Please enter your username")
                setIsShowMessageBoxModalOpen(true);
                return;
            }
            if (!category) {
                setTitle("Message");
                setMessage("Please enter your password")
                setIsShowMessageBoxModalOpen(true);
                return;
            }

            const res = await fetch(`${process.env.REACT_APP_APIURL}/menuItems/create`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
                    body: JSON.stringify({ name: "menu one", description: "this is description", category: "beverage", price: 2.0 }),
                });

            const result = await res.json();
            setTitle("Message");
            setMessage(result.message)
            setIsShowMessageBoxModalOpen(true);
            if (result.errorCode == 200) {

                setName('');
            }
        } catch (error) {
            console.log(error);

            setTitle("Message");
            setMessage("Internal server");
            setIsShowMessageBoxModalOpen(true);
        }
    };

    return (
        <div className="w-full container mx-auto p-4">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Add new Menu</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Please enter your menu name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="block w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Please enter your category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="block w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Please enter your price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="block w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Please enter your description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="block w-full border p-2 rounded"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add menu
                    </button>
                </form>
                <div>
                    {isShowMessageBoxModalOpen && (
                        <MessageBox onClose={handleClose} title={title} message={message} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddMenu;
