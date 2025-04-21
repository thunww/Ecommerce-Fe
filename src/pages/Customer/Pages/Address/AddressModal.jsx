// components/AddressModal.jsx
import React from "react";
import AddressForm from "../../../../components/customer/Components/AddressSelector/index";

const AddressModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const handleFormSubmit = (formData) => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl">
        <h3 className="text-lg font-bold mb-4">
          {initialData.address_id ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
        </h3>
        <AddressForm
          initialData={initialData}
          onSubmit={handleFormSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default AddressModal;
