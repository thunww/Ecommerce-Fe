import AppRoutes from "./routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthCheck from "./hooks/useAuthCheck";

function App() {
    // Sử dụng hook để đảm bảo thông tin auth được kiểm tra khi khởi động ứng dụng
    const { loading } = useAuthCheck();

    // Hiển thị indicator loading nếu đang kiểm tra thông tin auth
    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    return (
        <>
            <AppRoutes />
            <ToastContainer />
        </>
    );
}

export default App;
