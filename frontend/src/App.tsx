import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import LeftMenu from "./components/LeftMenu";
import MenuList from "./components/MenuList";
import OrderList from "./components/OrderList";
import UserList from "./components/UserList";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reservation from "./pages/Reservation";
import Reservations from "./pages/Reservations";
import Signup from "./pages/Signup";
import TableManagement from "./pages/TableManagement";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="flex">
          <LeftMenu />
          <div className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/menus" element={<MenuList />} />
              <Route path="/customers" element={<UserList />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/tables" element={<TableManagement />} />
              <Route path="/create-reservation" element={<Reservation />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/view-orders" element={<OrderList />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
