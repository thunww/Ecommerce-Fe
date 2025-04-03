import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="dashboard">
            <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
            <div className="welcome mb-8">
                <p className="text-lg">Xin chào, <span className="font-semibold">{user?.name || 'Người dùng'}</span>!</p>
                <p className="mt-2 text-gray-600">
                    Từ dashboard của tài khoản, bạn có thể xem các đơn hàng gần đây, quản lý địa chỉ giao hàng và cập nhật thông tin cá nhân.
                </p>
            </div>

            <div className="account-summary">
                <h3 className="text-xl font-semibold mb-4">Tổng quan tài khoản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="account-box border p-4 rounded-md">
                        <h4 className="font-semibold mb-2">Thông tin cá nhân</h4>
                        <p className="text-gray-600 mb-1">{user?.name || 'Chưa cập nhật'}</p>
                        <p className="text-gray-600">{user?.email || 'Chưa cập nhật'}</p>
                        <button className="mt-3 text-blue-600 hover:text-blue-800">Chỉnh sửa</button>
                    </div>

                    <div className="account-box border p-4 rounded-md">
                        <h4 className="font-semibold mb-2">Đơn hàng gần đây</h4>
                        <p className="text-gray-600 mb-1">Bạn chưa có đơn hàng nào.</p>
                        <button className="mt-3 text-blue-600 hover:text-blue-800">Xem tất cả đơn hàng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
