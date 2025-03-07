import React, { useState } from "react";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "Nguyễn Văn Anh",
    id: "SP10023",
    rating: 4.7,
    totalOrders: 1286,
    completionRate: "98%",
    onTimeRate: "96%",
    avatar: "", // Thêm trạng thái avatar
    contact: {
      phone: "0912.345.678",
      email: "vananh@shiperpro.vn",
      location: "Quận 1, Quận 3, Quận 10",
      joined: "15/06/2023",
      vehicle: "Honda Wave - 59P1-23456",
    },
    reviews: [
      {
        name: "Trần Thị Bình",
        order: "ORD00893",
        date: "05/03/2025",
        rating: 5,
        comment:
          "Shipper rất thân thiện và giao hàng cực nhanh. Đóng gói cẩn thận, không bị hư hỏng gì cả.",
      },
      {
        name: "Lê Văn Cường",
        order: "ORD00725",
        date: "02/03/2025",
        rating: 5,
        comment:
          "Shipper đúng giờ và rất lịch sự. Đã đợi tôi xuống lấy hàng mà không phàn nàn gì.",
      },
      {
        name: "Phạm Thị Diễm",
        order: "ORD00684",
        date: "28/02/2025",
        rating: 4,
        comment:
          "Giao hàng nhanh, nhưng không gọi trước khi đến như tôi dặn trong ghi chú.",
      },
    ],
  });

  const [filter, setFilter] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(profileData);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfileData(editProfile);
    setIsEditing(false);
  };

  const filteredReviews =
    filter === 0
      ? profileData.reviews
      : profileData.reviews.filter((review) => review.rating === filter);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div className="flex items-center mb-4">
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          {profileData.avatar ? (
            <img src={profileData.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
              150x150
            </div>
          )}
        </label>
        <div className="ml-4">
          <h2 className="text-xl font-bold">{profileData.name}</h2>
          <p className="text-gray-500">ID: {profileData.id}</p>
          <p className="text-yellow-500 font-bold text-lg">⭐ {profileData.rating} (5 đánh giá)</p>
          <p className="text-gray-600">Tổng đơn hàng: {profileData.totalOrders}</p>
          <p className="text-gray-600">Tỷ lệ hoàn thành: {profileData.completionRate}</p>
          <p className="text-gray-600">Tỷ lệ đúng giờ: {profileData.onTimeRate}</p>
        </div>
      </div>
      <div className="border-t pt-4">
        <h3 className="font-bold text-lg mb-2">Thông tin liên hệ</h3>
        {isEditing ? (
          <div>
            <input type="text" name="phone" value={editProfile.contact.phone} onChange={handleEditChange} className="border p-1 rounded w-full mb-2" />
            <input type="email" name="email" value={editProfile.contact.email} onChange={handleEditChange} className="border p-1 rounded w-full mb-2" />
            <input type="text" name="location" value={editProfile.contact.location} onChange={handleEditChange} className="border p-1 rounded w-full mb-2" />
            <input type="text" name="vehicle" value={editProfile.contact.vehicle} onChange={handleEditChange} className="border p-1 rounded w-full mb-2" />
            <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">Lưu</button>
          </div>
        ) : (
          <div>
            <p>📞 {profileData.contact.phone}</p>
            <p>✉️ {profileData.contact.email}</p>
            <p>📍 Khu vực: {profileData.contact.location}</p>
            <p>📅 Đã tham gia: {profileData.contact.joined}</p>
            <p>🚗 {profileData.contact.vehicle}</p>
            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">Chỉnh sửa</button>
          </div>
        )}
      </div>
      <div className="border-t pt-4 mt-4">
        <h3 className="font-bold text-lg mb-2">Đánh giá</h3>
        <div className="flex gap-2 mb-4">
          {[0, 5, 4, 3, 2, 1].map((star) => (
            <button key={star} className={`px-3 py-1 border rounded ${filter === star ? "bg-blue-500 text-white" : "bg-gray-100"}`} onClick={() => setFilter(star)}>
              {star === 0 ? "Tất cả" : `${star} ⭐`}
            </button>
          ))}
        </div>
        {filteredReviews.map((review, index) => (
          <div key={index} className="mb-4 border-b pb-2">
            <h4 className="font-semibold">{review.name}</h4>
            <p className="text-gray-500 text-sm">Đơn hàng: {review.order} - {review.date}</p>
            <p className="text-yellow-500">{"⭐".repeat(review.rating)}</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
