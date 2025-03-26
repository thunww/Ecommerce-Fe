import React, { useState, useEffect } from "react";
import ProductPage from "../../components/seller/Productpage/ProductPage";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import productService from "../../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state) => state.auth.user);
  const shopId = user?.shopId; // Lưu lại để truyền xuống components con

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Gọi service để lấy sản phẩm - API sẽ tự xác định vendor từ token
        const data = await productService.getProductsByShopId();
        
        // Kiểm tra và xử lý dữ liệu trả về
        if (data && Array.isArray(data)) {
          // Định dạng lại dữ liệu sản phẩm để phù hợp với component
          const formattedProducts = data.map(product => ({
            id: product.product_id,
            name: product.product_name,
            image: product.product_image || 'https://via.placeholder.com/150', // Sử dụng ảnh mặc định nếu không có
            price: product.price,
            stock: product.stock_quantity || 0,
            sales: product.total_sales || 0,
            sku: product.sku || 'N/A',
            contentQuality: product.content_score || 'N/A',
            status: product.status || 'unpublished',
            category: product.category_name,
            type: product.product_type || 'physical'
          }));
          
          setProducts(formattedProducts);
          console.log("Sản phẩm đã được tải:", formattedProducts);
        } else {
          setProducts([]);
          console.log("Không có sản phẩm nào được tìm thấy");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
        toast.error("Lỗi khi tải sản phẩm: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hàm để refresh dữ liệu sau khi có thay đổi (xóa, cập nhật)
  const refreshProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductsByShopId();
      
      if (data && Array.isArray(data)) {
        const formattedProducts = data.map(product => ({
          id: product.product_id,
          name: product.product_name,
          image: product.product_image || 'https://via.placeholder.com/150',
          price: product.price,
          stock: product.stock_quantity || 0,
          sales: product.total_sales || 0,
          sku: product.sku || 'N/A',
          contentQuality: product.content_score || 'N/A',
          status: product.status || 'unpublished',
          category: product.category_name,
          type: product.product_type || 'physical'
        }));
        
        setProducts(formattedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải lại sản phẩm:", error);
      toast.error("Không thể tải lại danh sách sản phẩm.");
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
      />
    </div>
  );
};

export default Products;
