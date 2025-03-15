import { BrowserRouter as Router } from "react-router-dom";
import ShipperRoutes from "./routes/ShipperRoutes"; // Đảm bảo đường dẫn đúng
import SideBar from "./pages/Shipper/components/Header/SideBar";
import "./index.css";

function App() {
  return (

      <div className="flex">
    

        {/* Nội dung chính của trang */}
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <ShipperRoutes />
        </div>
      </div>
 
  );
}

export default App;
