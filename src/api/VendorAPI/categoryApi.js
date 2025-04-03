import axiosClient from "../axiosClient";


const categoryService = {
  getAllCategories: () => axiosClient.get("/vendor/shop/category"),
};

export default categoryService;