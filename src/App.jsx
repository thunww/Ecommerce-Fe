import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatWidget from "./components/customer/Components/ChatWidget";
// import "antd/dist/reset.css";


function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
      <ChatWidget />
    </>
  );
}

export default App;
