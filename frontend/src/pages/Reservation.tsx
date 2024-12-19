import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Table {
  id: number;
  name: string;
  capacity: number;
  status: "AVAILABLE" | "RESERVED" | "OCCUPIED";
}

const Reservation = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [userId, setUserId] = useState<number>(5);

  useEffect(() => {
    if (user?.token) {
      fetch(`${process.env.REACT_APP_APIURL}/tables/list`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setTables(data))
        .catch((error) => console.error("Error fetching tables:", error));
    }
  }, [user?.token]);

  const handleReserve = () => {
    if (!selectedTable) {
      alert("Please select a table!");
      return;
    }

    fetch(
      `${process.env.REACT_APP_APIURL}/reservations/create/${selectedTable}/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },

        body: JSON.stringify({
          title,
          note,
          time,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Reservation successful!");
          setTitle("");
          setNote("");
          setTime("");
          setSelectedTable(null);
        } else {
          alert("Failed to reserve table.");
        }
      })
      .catch((error) => console.error("Error reserving table:", error));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Reserve a Table</h1>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Available Tables</h2>
        <ul className="space-y-4">
          {tables.map((table) => (
            <li
              key={table.id}
              className="border p-4 rounded shadow-lg flex justify-between"
            >
              <div>
                <p>Table #{table.name}</p>
                <p>Capacity: {table.capacity}</p>
                <p>Status: {table.status}</p>
              </div>
              {table.status === "AVAILABLE" && (
                <button
                  onClick={() => setSelectedTable(table.id)}
                  className={`px-4 py-2 rounded text-white ${
                    selectedTable === table.id
                      ? "bg-green-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {selectedTable === table.id ? "Selected" : "Select"}
                </button>
              )}
              {table.status === "RESERVED" && (
                <button className={`px-4 py-2 rounded text-white bg-red-500`}>
                  {selectedTable === table.id
                    ? "Selected"
                    : table.status === "RESERVED"
                    ? "RESERVED"
                    : "Select"}
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
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full mb-2 border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="block w-full mb-2 border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
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
