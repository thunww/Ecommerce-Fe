import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllAddresses } from "../../../../redux/addressSlice";
import { Link } from "react-router-dom";

const DefaultAddress = () => {
  const dispatch = useDispatch();
  const { addresses, loading } = useSelector((state) => state.addresses);

  useEffect(() => {
    dispatch(fetchAllAddresses());
  }, [dispatch]);

  const defaultAddress = addresses.find((addr) => addr.is_default === true);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md relative">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Địa chỉ nhận hàng
        </h2>
        <Link
          to="/my-account/addresses"
          className="text-blue-500 hover:underline text-sm"
        >
          Thay đổi
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Đang tải...</p>
      ) : defaultAddress ? (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">
                {defaultAddress.recipient_name}
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">{defaultAddress.phone}</span>
            </div>
            <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded">
              Mặc định
            </span>
          </div>
          <p className="text-gray-600 mt-2">
            {defaultAddress.address_line}, {defaultAddress.ward},{" "}
            {defaultAddress.district}, {defaultAddress.city}
          </p>
        </div>
      ) : (
        <p className="text-gray-600">Chưa có địa chỉ mặc định</p>
      )}
    </div>
  );
};

export default DefaultAddress;
