import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import LeftMenu from "./components/LeftMenu";
import OrderList from "./components/OrderList";
import UserList from "./components/UserList";
import { AuthProvider } from "./context/AuthContext";
import AddMenu from "./pages/AddMenu";
import AddStaff from "./pages/AddStaff";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Reservation from "./pages/Reservation";
import Reservations from "./pages/Reservations";
import Signup from "./pages/Signup";
import TableManagement from "./pages/TableManagement";

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Header />
//         <LeftMenu />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/add-menu" element={<AddMenu />} />
//           <Route path="/add-staff" element={<AddStaff />} />
//           <Route path="/orders" element={<OrderList />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="flex">
          <LeftMenu />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/add-menu" element={<AddMenu />} />
              <Route path="/add-staff" element={<AddStaff />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/tables" element={<TableManagement />} />
              <Route path="/create-reservation" element={<Reservation />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/customers" element={<UserList />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
