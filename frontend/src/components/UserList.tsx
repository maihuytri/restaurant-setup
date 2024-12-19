import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface User {
  id: number;
  name: string;
  role: string;
  contactInfo: string;
}

const UserList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  console.log("user is", user);

  useEffect(() => {
    if (user?.token) {
      fetch("http://localhost:8080/users", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [user?.token]);

  return (
    <div className="mt-8">
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="border p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p>Role: {user.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
