


const ConfirmMessageBox = ({ onOk, onClose, title, message }: { onOk: () => void, onClose: () => void, title: string, message: string }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <p>{message}</p>
                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Close
                    </button>
                    &nbsp;
                    <button onClick={onOk} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmMessageBox;