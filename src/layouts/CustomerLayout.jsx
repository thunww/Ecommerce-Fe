import { Outlet } from "react-router-dom";
import Header from "../components/customer/Components/Header";
import Footer from "../components/customer/Components/Footer";

const CustomerLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <Header />

            {/* Nội dung chính */}
            <main className="flex-1 p-6 overflow-auto">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CustomerLayout;
