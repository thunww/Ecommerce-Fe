import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideBar from "./pages/Shipper/components/Header/SideBar";
import Dashboard from "./pages/Shipper/pages/Dashboard";
import Orders from "./pages/Shipper/pages/Orders";
import OrderDetail from "./pages/Shipper/pages/OrderDetail";
import Profile from "./pages/Shipper/pages/Profile";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar cố định */}
        <SideBar />

        {/* Nội dung thay đổi theo route */}
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
