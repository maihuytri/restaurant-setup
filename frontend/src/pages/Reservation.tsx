import React, { useEffect, useState } from 'react';

interface Table {
    id: number;
    tableNumber: number;
    capacity: number;
    status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED';
}

const Reservation = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [contactInfo, setContactInfo] = useState('');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_APIURL}/api/tables`)
            .then((response) => response.json())
            .then((data) => setTables(data))
            .catch((error) => console.error('Error fetching tables:', error));
    }, []);

    const handleReserve = () => {
        if (!selectedTable) {
            alert('Please select a table!');
            return;
        }

        const reservation = {
            customerName,
            contactInfo,
            table: { id: selectedTable },
            reservationTime: new Date().toISOString(),
        };

        fetch(`${process.env.REACT_APP_APIURL}/api/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservation),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Reservation successful!');
                    setCustomerName('');
                    setContactInfo('');
                    setSelectedTable(null);
                } else {
                    alert('Failed to reserve table.');
                }
            })
            .catch((error) => console.error('Error reserving table:', error));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Reserve a Table</h1>
            <div className="mb-4">
                <h2 className="text-xl font-bold">Available Tables</h2>
                <ul className="space-y-4">
                    {tables.map((table) => (
                        <li key={table.id} className="border p-4 rounded shadow-lg flex justify-between">
                            <div>
                                <p>Table #{table.tableNumber}</p>
                                <p>Capacity: {table.capacity}</p>
                                <p>Status: {table.status}</p>
                            </div>
                            {table.status === 'AVAILABLE' && (
                                <button
                                    onClick={() => setSelectedTable(table.id)}
                                    className={`px-4 py-2 rounded text-white ${selectedTable === table.id ? 'bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                                >
                                    {selectedTable === table.id ? 'Selected' : 'Select'}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Reservation Details</h2>
                <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="block w-full mb-2 border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Contact Info"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="block w-full mb-2 border p-2 rounded"
                />
                <button
                    onClick={handleReserve}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Reserve Table
                </button>
            </div>
        </div>
    );
};

export default Reservation;
