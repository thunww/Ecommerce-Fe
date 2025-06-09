import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasShownToast, setHasShownToast] = useState(false); // chặn toast 2 lần

    useEffect(() => {
        const confirmPayment = async () => {
            const queryParams = new URLSearchParams(location.search);
            const txnRef = queryParams.get("vnp_TxnRef");

            // Nếu thiếu vnp_TxnRef thì không gọi API
            if (!txnRef) {
                setPaymentInfo({ success: false });
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/api/v1/payments/vnpay/callback?${queryParams.toString()}`);
                const result = response.data;

                const amount = queryParams.get("vnp_Amount");
                const payDate = queryParams.get("vnp_PayDate");
                const formattedAmount = amount ? (Number(amount) / 100).toLocaleString("vi-VN") : null;

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

    // Hiển thị toast đúng 1 lần sau khi dữ liệu đã load
    useEffect(() => {
        if (!loading && paymentInfo && !hasShownToast) {
            if (paymentInfo.success) {
                toast.success("Đặt hàng & thanh toán thành công!");
            } else {
                toast.error("Thanh toán thất bại hoặc bị huỷ.");
            }
            setHasShownToast(true);
        }
    }, [loading, paymentInfo, hasShownToast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-6">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">
                        Đang xác nhận thanh toán...
                    </p>
                    <p className="text-gray-500">
                        Vui lòng chờ trong giây lát
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header with gradient */}
                    <div className={`p-8 text-center ${paymentInfo?.success
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : 'bg-gradient-to-r from-red-500 to-rose-600'
                        }`}>
                        <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <span className="text-4xl">
                                {paymentInfo?.success ? "✅" : "❌"}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {paymentInfo?.success ? "Thanh toán thành công!" : "Thanh toán thất bại"}
                        </h1>
                        <p className="text-white/90 text-sm">
                            {paymentInfo?.success
                                ? "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi"
                                : "Đã có lỗi xảy ra trong quá trình thanh toán"}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Order Info */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    Thông tin đơn hàng
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
                                        <span className="font-bold text-gray-800 bg-white px-3 py-1 rounded-lg text-sm">
                                            #{paymentInfo?.orderId}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Số tiền:</span>
                                        <span className="font-bold text-xl text-blue-600">
                                            {paymentInfo?.amount}₫
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Ngày thanh toán:</span>
                                        <span className="text-gray-800 font-medium">
                                            {paymentInfo?.payDate}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => navigate("/my-account/orders")}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2 group"
                            >
                                <span className="text-xl group-hover:scale-110 transition-transform duration-200">🛍️</span>
                                <span>Xem đơn hàng của tôi</span>
                            </button>

                            {/* Additional Actions */}
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => navigate("/")}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <span>🏠</span>
                                    <span>Về trang chủ</span>
                                </button>

                                <button
                                    onClick={() => navigate("/search?q=")}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <span>🛒</span>
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
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
                            hỗ trợ khách hàng
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;