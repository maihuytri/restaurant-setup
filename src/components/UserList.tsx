import React, { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    role: string;
    contactInfo: string;
}

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    return (
        <div className="mt-8">
            <ul className="space-y-4">
                {users.map((user) => (
                    <li key={user.id} className="border p-4 rounded shadow-lg">
                        <h2 className="text-lg font-bold">{user.name}</h2>
                        <p>Role: {user.role}</p>
                        <p>Contact: {user.contactInfo}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
