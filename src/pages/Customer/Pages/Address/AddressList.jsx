import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../../../redux/addressSlice";
import AddressCard from "./AddressCard";
import AddressModal from "./AddressModal";

const AddressList = () => {
  const dispatch = useDispatch();
  const { addresses, loading } = useSelector((state) => state.addresses);

  // State để điều khiển modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // State cho modal xóa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAllAddresses());
  }, [dispatch]);

  const handleUpdate = (id) => {
    const addressToUpdate = addresses.find((addr) => addr.address_id === id);
    setSelectedAddress(addressToUpdate);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const addressToDelete = addresses.find((addr) => addr.address_id === id);
    setAddressToDelete(addressToDelete);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      dispatch(deleteAddress(addressToDelete.address_id)).then(() => {
        dispatch(fetchAllAddresses());
      });
      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
    }
  };

  const handleSetDefault = (id) => {
    dispatch(setDefaultAddress(id));
  };

  const handleAddNewAddress = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (selectedAddress) {
      dispatch(
        updateAddress({
          addressId: selectedAddress.address_id,
          addressData: formData,
        })
      );
    } else {
      dispatch(createAddress(formData));
    }
  };

  // Modal xóa giống Shopee
  const DeleteConfirmModal = () => {
    if (!isDeleteModalOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white rounded-lg p-6 w-96 max-w-md z-10">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">Xác nhận xóa</h3>
            <p className="mb-6 text-gray-600">
              Bạn có chắc chắn muốn xóa địa chỉ này?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
              >
                Trở lại
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Địa chỉ của tôi</h2>
        <button
          onClick={handleAddNewAddress}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Thêm địa chỉ mới
        </button>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.address_id}
              address={addr}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedAddress || {}}
      />
      <DeleteConfirmModal />
    </div>
  );
};

export default AddressList;
