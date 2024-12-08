import React, { useEffect, useState } from 'react';

interface Table {
    id: number;
    tableNumber: number;
    capacity: number;
    status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED';
}

const TableManagement = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [currentTable, setCurrentTable] = useState<Table | null>(null);
    const [tableNumber, setTableNumber] = useState<number>(0);
    const [capacity, setCapacity] = useState<number>(0);

    // Fetch tables from API
    useEffect(() => {
        fetch(`${process.env.REACT_APP_APIURL}/api/tables`)
            .then((response) => response.json())
            .then((data) => setTables(data))
            .catch((error) => console.error('Error fetching tables:', error));
    }, []);

    // Handle Add/Update Table
    const handleSave = () => {
        const tableData = { tableNumber, capacity, status: 'AVAILABLE' };

        const url = editMode
            ? `${process.env.REACT_APP_APIURL}/api/tables/${currentTable?.id}`
            : `${process.env.REACT_APP_APIURL}/api/tables`;

        const method = editMode ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tableData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (editMode) {
                    setTables((prevTables) =>
                        prevTables.map((table) => (table.id === data.id ? data : table))
                    );
                } else {
                    setTables((prevTables) => [...prevTables, data]);
                }
                resetForm();
            })
            .catch((error) => console.error('Error saving table:', error));
    };

    // Handle Delete Table
    const handleDelete = (id: number) => {
        fetch(`${process.env.REACT_APP_APIURL}/api/tables/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setTables((prevTables) => prevTables.filter((table) => table.id !== id));
            })
            .catch((error) => console.error('Error deleting table:', error));
    };

    // Reset Form State
    const resetForm = () => {
        setEditMode(false);
        setCurrentTable(null);
        setTableNumber(0);
        setCapacity(0);
    };

    // Set Form for Editing
    const handleEdit = (table: Table) => {
        setEditMode(true);
        setCurrentTable(table);
        setTableNumber(table.tableNumber);
        setCapacity(table.capacity);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Table Management</h1>

            {/* Form for Add/Edit Table */}
            <div className="mb-6">
                <h2 className="text-xl font-bold">{editMode ? 'Edit Table' : 'Add Table'}</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                    className="space-y-4"
                >
                    <input
                        type="number"
                        placeholder="Table Number"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(Number(e.target.value))}
                        required
                        className="block w-full border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Capacity"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        required
                        className="block w-full border p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {editMode ? 'Update Table' : 'Add Table'}
                    </button>
                    {editMode && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-4"
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            {/* Table List */}
            <h2 className="text-xl font-bold mb-4">Table List</h2>
            <ul className="space-y-4">
                {tables.map((table) => (
                    <li key={table.id} className="border p-4 rounded shadow-lg flex justify-between">
                        <div>
                            <p>Table #{table.tableNumber}</p>
                            <p>Capacity: {table.capacity}</p>
                            <p>Status: {table.status}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(table)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(table.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TableManagement;
