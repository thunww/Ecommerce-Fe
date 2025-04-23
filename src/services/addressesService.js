import addressesApi from "../api/addressesApi";

const addressService = {
  getAllAddresses: async () => {
    try {
      const response = await addressesApi.getAllAddresses();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAddress: async (addressData) => {
    try {
      const response = await addressesApi.createAddress(addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAddressById: async (addressId) => {
    try {
      const response = await addressesApi.getAddressById(addressId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAddress: async (addressId, addressData) => {
    try {
      const response = await addressesApi.updateAddress(addressId, addressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAddress: async (addressId) => {
    try {
      const response = await addressesApi.deleteAddress(addressId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  setDefaultAddress: async (addressId) => {
    try {
      const response = await addressesApi.setDefaultAddress(addressId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default addressService;
