import axiosClient from "./axiosClient";

const adminApi ={
    getAllUsers:  () =>axiosClient.get("/admin/users"),
};
export default adminApi;
