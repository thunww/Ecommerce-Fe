import axiosClient from "./axiosClient";

const addressesApi = {
  getAllAddresses: () => axiosClient.get("/addresses"),
  createAddress: (addressData) => axiosClient.post("/addresses", addressData),
  getAddressById: (address_id) => axiosClient.get(`/addresses/${address_id}`),
  updateAddress: (address_id, addressData) =>
    axiosClient.put(`/addresses/${address_id}`, addressData),
  deleteAddress: (address_id) => axiosClient.delete(`/addresses/${address_id}`),
  setDefaultAddress: (address_id) =>
    axiosClient.patch(`/addresses/${address_id}/default`, {}),
};

export default addressesApi;
