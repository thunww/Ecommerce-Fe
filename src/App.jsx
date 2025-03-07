import { BrowserRouter as Router } from "react-router-dom";
import SideBar from "./pages/Shipper/components/Header/SideBar";
import ShipperRoutes from "./pages/Shipper/ShipperRoutes";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar cố định */}
        <SideBar />

        {/* Nội dung thay đổi theo route */}
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <ShipperRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;