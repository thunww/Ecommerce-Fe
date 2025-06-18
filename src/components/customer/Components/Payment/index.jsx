import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiCheckCircle,
  FiXCircle,
  FiShoppingCart,
  FiHome,
  FiPackage,
  FiCreditCard,
  FiCalendar,
  FiHash,
} from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      const queryParams = new URLSearchParams(location.search);
      const txnRef = queryParams.get("vnp_TxnRef");

      if (!txnRef) {
        setPaymentInfo({ success: false });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `/payments/vnpay/callback?${queryParams.toString()}`
        );
        const result = response.data;

        const amount = queryParams.get("vnp_Amount");
        const payDate = queryParams.get("vnp_PayDate");
        const formattedAmount = amount
          ? (Number(amount) / 100).toLocaleString("vi-VN")
          : null;

        setPaymentInfo({
          orderId: txnRef,
          amount: formattedAmount,
          payDate,
          success: result.code === "00",
        });
      } catch (error) {
        setPaymentInfo({ success: false });
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [location.search]);

  useEffect(() => {
    if (!loading && paymentInfo && !hasShownToast) {
      if (paymentInfo.success) {
        toast.success("Đặt hàng & thanh toán thành công!", { autoClose: 3000 });
      } else {
        toast.error("Thanh toán thất bại hoặc bị hủy.", { autoClose: 3000 });
      }
      setHasShownToast(true);
    }
  }, [loading, paymentInfo, hasShownToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            Đang xác nhận thanh toán...
          </p>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          {/* Header with gradient */}
          <div
            className={`p-6 text-center ${
              paymentInfo?.success
                ? "bg-gradient-to-r from-blue-500 to-blue-700"
                : "bg-gradient-to-r from-red-400 to-red-600"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              {paymentInfo?.success ? (
                <FiCheckCircle className="text-4xl text-white" />
              ) : (
                <FiXCircle className="text-4xl text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {paymentInfo?.success
                ? "Thanh toán thành công!"
                : "Thanh toán thất bại"}
            </h1>
            <p className="text-white/90 text-sm">
              {paymentInfo?.success
                ? "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi"
                : "Đã có lỗi xảy ra trong quá trình thanh toán"}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-blue-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Thông tin đơn hàng
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <FiHash className="text-blue-500" />
                      Mã đơn hàng:
                    </span>
                    <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded-lg text-sm">
                      #{paymentInfo?.orderId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <FiCreditCard className="text-blue-500" />
                      Số tiền:
                    </span>
                    <span className="font-bold text-xl text-blue-600">
                      {paymentInfo?.amount}₫
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <FiCalendar className="text-blue-500" />
                      Ngày thanh toán:
                    </span>
                    <span className="text-gray-800 font-medium">
                      {paymentInfo?.payDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate("/my-account/orders")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FiPackage className="text-xl" />
                <span>Xem đơn hàng của tôi</span>
              </button>

              {/* Additional Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FiHome className="text-lg" />
                  <span>Về trang chủ</span>
                </button>

                <button
                  onClick={() => navigate("/search?q=")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FiShoppingCart className="text-lg" />
                  <span>Tiếp tục mua sắm</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Có thắc mắc? Liên hệ{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              hỗ trợ khách hàng
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
