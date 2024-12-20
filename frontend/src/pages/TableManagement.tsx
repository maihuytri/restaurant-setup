import { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "../context/AuthContext";
import TableSkeleton from "../skeletons/TableSkeleton";

interface Table {
  id: number;
  name: string;
  capacity: number;
  status: "AVAILABLE" | "RESERVED" | "OCCUPIED";
}

const TableManagement = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  const [name, setName] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch tables from API
  useEffect(() => {
    const fetchTables = async () => {
      try {
        if (user?.token) {
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
    fetchTables();
  }, [user?.token]);

  // Handle Add/Update Table
  const handleSave = () => {
    const tableData = { name, capacity, status: "AVAILABLE" };

    const url = editMode
      ? `${process.env.REACT_APP_APIURL}/tables/${currentTable?.id}`
      : `${process.env.REACT_APP_APIURL}/tables/`;

    const method = editMode ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
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
      .catch((error) => console.error("Error saving table:", error));
  };

  // Handle Delete Table
  const handleDelete = (id: number) => {
    fetch(`${process.env.REACT_APP_APIURL}/tables/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then(() => {
        setTables((prevTables) =>
          prevTables.filter((table) => table.id !== id)
        );
      })
      .catch((error) => console.error("Error deleting table:", error));
  };

  // Reset Form State
  const resetForm = () => {
    setEditMode(false);
    setCurrentTable(null);
    setName("");
    setCapacity(0);
  };

  // Set Form for Editing
  const handleEdit = (table: Table) => {
    setEditMode(true);
    setCurrentTable(table);
    setName(table.name);
    setCapacity(table.capacity);
  };

  return (
    // <SkeletonTheme>
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Table Management</h1>

      {/* Form for Add/Edit Table */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          {editMode ? "Edit Table" : "Add Table"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          <input
            placeholder="Table Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            {editMode ? "Update Table" : "Add Table"}
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
      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Table List</h2>
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
        </>
      )}
    </div>
    // </SkeletonTheme>
  );
};

export default TableManagement;
