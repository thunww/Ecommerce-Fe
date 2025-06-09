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
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-lg font-semibold animate-pulse text-gray-600">
                    🔄 Đang xác nhận thanh toán...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-2xl shadow-md border border-gray-100">
            <h2 className={`text-2xl font-bold mb-4 ${paymentInfo.success ? 'text-green-600' : 'text-red-600'}`}>
                {paymentInfo.success ? "✅ Thanh toán thành công" : "❌ Thanh toán thất bại"}
            </h2>

            <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">Mã đơn hàng:</span> #{paymentInfo.orderId}</p>
                <p><span className="font-medium">Số tiền:</span> {paymentInfo.amount}₫</p>
                <p><span className="font-medium">Ngày thanh toán:</span> {paymentInfo.payDate}</p>
            </div>

            <button
                onClick={() => navigate("/my-account/orders")}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
                🛍️ Về đơn hàng của tôi
            </button>
        </div>
    );
};

export default Payment;
