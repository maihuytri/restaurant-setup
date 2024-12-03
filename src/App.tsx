import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import OrderMenu from './components/OrderMenu';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Header from './components/Header';
import LeftMenu from './components/LeftMenu';
import AddMenu from './pages/AddMenu';
import AddStaff from './pages/AddStaff';
import OrderList from './components/OrderList';

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
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;