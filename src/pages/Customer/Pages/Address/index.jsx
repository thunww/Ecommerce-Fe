import React from "react";
import AddressForm from "../../../../components/customer/Components/AddressSelector";
const AddressPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Thông tin địa chỉ
        </h1>
        <AddressForm />
      </div>
    </div>
  );
};

export default AddressPage;
