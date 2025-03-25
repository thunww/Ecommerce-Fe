import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "../services/authService";
import { setUser } from "../redux/authSlice";

// Hook này kiểm tra và đảm bảo thông tin người dùng được cập nhật trong Redux sau khi đăng nhập
const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra nếu có token trong localStorage nhưng chưa có thông tin user trong Redux
    const checkAndLoadUserData = async () => {
      try {
        // Nếu không có token hoặc đã có thông tin user trong Redux, không cần xử lý thêm
        const token = localStorage.getItem("accessToken");
        if (!token || user) {
          setLoading(false);
          return;
        }

        // Nếu có token nhưng chưa có thông tin user, gọi API để lấy thông tin profile
        const profileData = await authService.getProfile();

        // Sử dụng action setUser thay vì dispatch trực tiếp để đảm bảo nhất quán
        dispatch(setUser(profileData.data.user));
      } catch (error) {
        console.error("Failed to load user data:", error);
        // Nếu lỗi xảy ra (ví dụ: token hết hạn), xóa token và thông tin user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
      } finally {
        setLoading(false);
      }
    };

    checkAndLoadUserData();
  }, [dispatch, user]);

  return { loading };
};

export default useAuthCheck;
