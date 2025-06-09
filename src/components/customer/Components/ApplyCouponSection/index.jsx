import { useEffect, useState } from "react";
import { TagIcon, TrashIcon } from "@heroicons/react/24/outline";
import couponApi from "@/api/couponApi";
import { toast } from "react-toastify";
import formatPrice from "@/utils/formatPrice";

const ApplyCouponSection = ({ cartId, coupon, onCouponApplied, onCouponRemoved }) => {
    const [couponCode, setCouponCode] = useState("");
    const [applying, setApplying] = useState(false);
    const [couponError, setCouponError] = useState(null);
    const [availableCoupons, setAvailableCoupons] = useState([]);

    useEffect(() => {
        fetchAvailableCoupons();
    }, []);

    const fetchAvailableCoupons = async () => {
        try {
            const response = await couponApi.getAvailableCoupons();
            setAvailableCoupons(response.data || []);
        } catch (err) {
            console.error("Lỗi lấy mã giảm giá:", err);
        }
    };

    const handleApply = async () => {
        if (!couponCode.trim()) return;

        try {
            setApplying(true);
            const res = await couponApi.applyCoupon(couponCode.trim(), cartId);
            toast.success("Áp dụng mã giảm giá thành công");
            onCouponApplied?.(res.data); // truyền dữ liệu nếu cần
            setCouponCode("");
            setCouponError(null);
        } catch (err) {
            console.error("Lỗi áp dụng mã:", err);
            setCouponError(err.response?.data || { message: "Áp dụng mã thất bại" });
        } finally {
            setApplying(false);
        }
    };

    const handleRemove = async () => {
        try {
            await couponApi.removeCoupon();
            toast.info("Đã xóa mã giảm giá");
            onCouponRemoved?.();
        } catch (err) {
            toast.error("Xóa mã thất bại");
        }
    };

    return (
        <div className="mb-6">
            {coupon ? (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mã giảm giá:</span>
                        <div className="flex items-center gap-2">
                            <span className="text-green-600 font-medium">
                                -{formatPrice(coupon.discount_amount || 0)}
                            </span>
                            <button
                                onClick={handleRemove}
                                className="text-red-500 hover:text-red-600"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        {coupon.discount_type === 'percentage'
                            ? `Giảm ${coupon.discount_value}%`
                            : `Giảm ${formatPrice(coupon.discount_value)}`}
                        {coupon.max_discount && ` (Tối đa ${formatPrice(coupon.max_discount)})`}
                    </div>
                </div>
            ) : (
                <>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nhập mã giảm giá"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <TagIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        <button
                            onClick={handleApply}
                            disabled={applying}
                            className="absolute right-2 top-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition-colors disabled:opacity-50"
                        >
                            {applying ? "Đang áp dụng..." : "Áp dụng"}
                        </button>
                    </div>

                    {availableCoupons.length > 0 && (
                        <div className="mt-2 space-y-1 text-sm text-gray-700">
                            <p className="text-gray-600 font-medium mb-1">Mã gợi ý:</p>
                            {availableCoupons.map((cp) => (
                                <button
                                    key={cp.code}
                                    onClick={() => setCouponCode(cp.code)}
                                    className="bg-gray-100 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                                >
                                    {cp.code} ({cp.description})
                                </button>
                            ))}
                        </div>
                    )}

                    {couponError && (
                        <p className="mt-2 text-sm text-red-600">
                            {couponError.message || String(couponError)}
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default ApplyCouponSection;
