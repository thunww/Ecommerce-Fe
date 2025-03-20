import React from 'react';
import CustomerRoutes from "./routes/CustomerRoutes";
import { UserProvider } from './contexts/UserContext';
import ShipperRoutes from "./routes/ShipperRoutes";
import "./index.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
      <CustomerRoutes />
        <ShipperRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={3}
        />
      </div>
    </UserProvider>
  );
};

export default App;
