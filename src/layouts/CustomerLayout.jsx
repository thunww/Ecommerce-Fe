import { Outlet } from "react-router-dom";
import Header from "../components/customer/Header";
import Footer from "../components/customer/Footer";

const CustomerLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header /> {/* Header cho Customer */}
            <main className="flex-grow">
                <Outlet /> {/* Nội dung của từng trang */}
            </main>
            <Footer /> {/* Footer cho Customer */}
        </div>
    );
};

export default CustomerLayout;
