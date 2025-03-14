import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Header from "./components/customer/Components/Header";
import Footer from "./components/customer/Components/Footer";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <AppRoutes />
            <Footer />
        </BrowserRouter>
    );
}

export default App; 
