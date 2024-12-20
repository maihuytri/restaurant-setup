import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ReservationSkeleton from "../skeletons/ReservationSkeleton";
import { extractUserIdFromToken } from "../utils";

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
  const [userId, setUserId] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    setLoading(true);
    try {
      if (user?.token) {
        let id = extractUserIdFromToken(user?.token);
        setUserId(id);

        const response = await fetch(
          `${process.env.REACT_APP_APIURL}/tables/list`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        const data = await response.json();
        setTables(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
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
          fetchTables();
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

  const handleSelectTable = (id: number) => {
    if (selectedTable) {
      setSelectedTable(null);
    } else {
      setSelectedTable(id);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Reserve a Table</h1>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Available Tables</h2>
        <ul className="space-y-4">
          {loading ? (
            <ReservationSkeleton />
          ) : !loading && tables.length > 0 ? (
            tables
              .filter((t) => t.status === "AVAILABLE")
              .map((table) => (
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
                      onClick={() => handleSelectTable(table.id)}
                      className={`px-4 py-2 rounded text-white ${
                        selectedTable === table.id
                          ? "bg-green-600 "
                          : "bg-blue-500 hover:bg-blue-600 "
                      }`}
                    >
                      {selectedTable === table.id ? "SELECTED" : "SELECT"}
                    </button>
                  )}
                  {/* {table.status === "RESERVED" && (
                  <button
                    className={`px-4 py-2 rounded text-white bg-red-300 cursor-not-allowed`}
                  >
                    RESERVED
                  </button>
                )} */}
                </li>
              ))
          ) : (
            <p className="font-medium text-gray-300 text-sm">
              No Available Tables
            </p>
          )}
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
          className="bg-blue-500  text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Reserve Table
        </button>
      </div>
    </div>
  );
};

export default Reservation;
