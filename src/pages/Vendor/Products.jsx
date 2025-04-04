import React, { useState, useEffect } from "react";
import ProductPage from "../../components/seller/Productpage/HomeProduct/ProductPage";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import productService from "../../services/productService";
import { getAllCategory } from "../../services/vendorService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state) => state.auth.user);
  const shopId = user?.shopId;

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategory();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        toast.error("Không thể tải danh sách danh mục");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductsByShopId();

        if (data && Array.isArray(data)) {
          const formattedProducts = data.map((product) => ({
            id: product.product_id,
            name: product.product_name,
            image:
              product.images && product.images.length > 0
                ? product.main_image
                : "https://via.placeholder.com/150",
            price: product.price,
            stock: product.stock || 0,
            sales: product.sold || 0,
            sku: product.sku || "N/A",
            contentQuality: product.content_score || "N/A",
            status: product.is_active ? "active" : "inactive",
            category_id: product.category_id,
            category: product.Category.category_name,
            type: product.product_type || "physical",
          }));

          setProducts(formattedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setError("Không thể tải danh sách sản phẩm");
        toast.error(
          "Lỗi khi tải sản phẩm: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductsByShopId();

      if (data && Array.isArray(data)) {
        const formattedProducts = data.map((product) => ({
          id: product.product_id,
          name: product.product_name,
          image:
            product.images && product.images.length > 0
              ? product.images[0].image_url
              : "https://via.placeholder.com/150",
          price: product.price,
          stock: product.stock || 0,
          sales: product.sold || 0,
          sku: product.sku || "N/A",
          contentQuality: product.content_score || "N/A",
          status: product.is_active ? "active" : "inactive",
          category_id: product.category_id,
          category: product.Category.category_name,
          type: product.product_type || "physical",
        }));

        setProducts(formattedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      toast.error("Không thể tải lại danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
      <ProductPage
        products={products}
        loading={loading}
        error={error}
        onProductChanged={refreshProducts}
        categories={categories}
      />
    </div>
  );
};

export default Products;
