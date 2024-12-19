import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LeftMenu = () => {
  const { user } = useAuth();
  if (!user?.role) return null;

  // Define menu items based on roles
  const menuItems: Record<string, { label: string; path: string }[]> = {
    manager: [
      { label: "Add Menu Item", path: "/add-menu" },
      { label: "Add Staff", path: "/add-staff" },
      { label: "View Orders", path: "/orders" },
      { label: "Customer List", path: "/customers" },
      { label: "Add Table", path: "/tables" },
      { label: "Reserve Table", path: "/create-reservation" },
    ],
    staff: [
      { label: "View Orders", path: "/orders" },
      { label: "Customer List", path: "/customers" },
    ],
    customer: [
      { label: "View Orders", path: "/view-orders" },
      { label: "Orders", path: "/" },
      { label: "Reserve Table", path: "/create-reservation" },
      { label: "Reservation List", path: "/reservations" },
    ],
  };

  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <ul className="space-y-2">
        {menuItems[user.role]?.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className="text-blue-500 hover:underline">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftMenu;
