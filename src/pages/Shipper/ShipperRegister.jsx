import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import ShipperLogo from "../../components/shipper/ShipperLogo";

const ShipperRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_type: "",
    license_plate: "",
    phone: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.warning("Vui lòng đăng nhập để đăng ký làm shipper");
        setIsAuthenticated(false);
        navigate("/login");
        return;
      }

      try {
        // Kiểm tra xem người dùng đã là shipper chưa
        const response = await axiosClient.get("/shippers/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          // Nếu đã là shipper (có thông tin shipper), chuyển hướng về trang landing
          toast.info("Bạn đã đăng ký làm shipper");
          navigate("/shipper");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        // Nếu lỗi 404 (chưa là shipper) thì cho phép tiếp tục đăng ký
        if (error.response && error.response.status === 404) {
          setIsAuthenticated(true);
        } else {
          console.error("Error checking shipper status:", error);
          toast.error("Có lỗi xảy ra khi kiểm tra thông tin shipper");
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const vehicleTypes = [
    { value: "bike", label: "Xe máy" },
    { value: "car", label: "Ô tô" },
    { value: "truck", label: "Xe tải" },
    { value: "van", label: "Xe tải nhỏ" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.vehicle_type) {
      errors.push("Vui lòng chọn loại phương tiện");
    }
    if (!formData.license_plate) {
      errors.push("Vui lòng nhập biển số xe");
    }
    if (!formData.phone) {
      errors.push("Vui lòng nhập số điện thoại");
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      errors.push("Số điện thoại không hợp lệ");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warning("Vui lòng đăng nhập để đăng ký làm shipper");
      navigate("/login");
      return;
    }

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axiosClient.post("/shippers/register", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(
          "Đăng ký shipper thành công. Vui lòng đợi admin xét duyệt."
        );
        navigate("/");
      } else {
        if (response.data.errors && Array.isArray(response.data.errors)) {
          response.data.errors.forEach((error) => {
            toast.error(error);
          });
        } else if (response.data.message) {
          toast.error(response.data.message);
        } else {
          toast.error("Đăng ký thất bại. Vui lòng thử lại sau.");
        }
      }
    } catch (error) {
      console.error("Error registering shipper:", error);

      if (error.response) {
        if (error.response.data.code === "DUPLICATE_PHONE") {
          toast.error(
            "Số điện thoại này đã được đăng ký. Vui lòng sử dụng số điện thoại khác."
          );
        } else if (error.response.data.code === "DUPLICATE_LICENSE_PLATE") {
          toast.error("Biển số xe này đã được đăng ký. Vui lòng kiểm tra lại.");
        } else if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          error.response.data.errors.forEach((err) => {
            toast.error(err);
          });
        } else if (error.response.data.message) {
          const message = error.response.data.message.toLowerCase();
          if (message.includes("phone") && message.includes("exist")) {
            toast.error(
              "Số điện thoại này đã được đăng ký. Vui lòng sử dụng số điện thoại khác."
            );
          } else if (message.includes("license") && message.includes("exist")) {
            toast.error(
              "Biển số xe này đã được đăng ký. Vui lòng kiểm tra lại."
            );
          } else {
            toast.error(error.response.data.message);
          }
        } else if (error.response.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
        } else if (error.response.status === 403) {
          toast.error("Bạn không có quyền thực hiện thao tác này.");
        } else if (error.response.status === 409) {
          toast.error(
            "Thông tin đăng ký đã tồn tại trong hệ thống. Vui lòng kiểm tra lại số điện thoại hoặc biển số xe."
          );
        } else {
          toast.error(`Lỗi: ${error.response.status} - Vui lòng thử lại sau.`);
        }
      } else if (error.request) {
        toast.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: "40px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <ShipperLogo
              width={30}
              height={30}
              className="shipper-logo"
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
            />
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0 0 20px",
              color: "#333",
            }}
          >
            Vui lòng đăng nhập
          </h2>
          <p
            style={{
              margin: "0 0 30px",
              color: "#666",
            }}
          >
            Bạn cần đăng nhập để đăng ký làm shipper
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#1890ff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 2px 8px rgba(24,144,255,0.35)",
            }}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        {/* Cột bên trái: Logo */}
        <div
          style={{
            flex: "1",
            backgroundColor: "#1890ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <ShipperLogo
            width={30}
            height={30}
            className="shipper-logo"
            style={{ width: "30px", height: "30px", objectFit: "contain" }}
          />
        </div>

        {/* Cột bên phải: Form đăng ký */}
        <div
          style={{
            flex: "2",
            padding: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#333",
            }}
          >
            Đăng ký làm Shipper
          </h2>
          <p
            style={{
              marginBottom: "20px",
              color: "#666",
            }}
          >
            Tham gia cùng chúng tôi để trở thành đối tác giao hàng
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Loại phương tiện:
              </label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  fontSize: "14px",
                  transition: "all 0.3s",
                }}
              >
                <option value="">Chọn loại phương tiện</option>
                {vehicleTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Biển số xe:
              </label>
              <input
                type="text"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                placeholder="Nhập biển số xe"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  fontSize: "14px",
                  transition: "all 0.3s",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Số điện thoại:
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  fontSize: "14px",
                  transition: "all 0.3s",
                }}
              />
            </div>

            <div style={{ marginTop: "32px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#1890ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "all 0.3s",
                  boxShadow: "0 2px 8px rgba(24,144,255,0.35)",
                }}
              >
                {loading ? "Đang xử lý..." : "Đăng ký ngay"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "transparent",
                  color: "#666",
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginTop: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                Quay lại
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShipperRegister;
