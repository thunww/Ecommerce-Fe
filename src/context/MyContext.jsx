import { createContext } from "react";

// Giá trị mặc định cho context (chỉ giữ lại các tính năng không liên quan đến đăng nhập)
const defaultContext = {
    setOpenProductDetailsModal: () => { },
    setOpenCartPanel: () => { },
    openCartPanel: false,
    toggleCartPanel: () => { }
};

const MyContext = createContext(defaultContext);

export default MyContext;