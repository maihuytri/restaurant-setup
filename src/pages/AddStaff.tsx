import React, { useState } from 'react';

const AddStaff = () => {
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_APIURL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, role: 'staff', contactInfo }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Staff added successfully!');
                    setName('');
                    setContactInfo('');
                } else {
                    alert('Failed to add staff.');
                }
            })
            .catch((error) => console.error('Error adding staff:', error));
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
                    placeholder="Contact Info"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    required
                    className="block w-full border p-2 rounded"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add Staff
                </button>
            </form>
        </div>
    );
};

export default AddStaff;
