import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaEdit, FaTrashAlt, FaTag, FaBoxOpen, FaClipboardList, FaImage, FaMoneyBillWave, FaThList, FaChartBar } from "react-icons/fa";
import productService from "../../services/productService";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);
        
        if (data) {
          // Định dạng dữ liệu sản phẩm
          const formattedProduct = {
            id: data.product_id,
            name: data.product_name,
            description: data.description,
            price: data.price,
            originalPrice: data.original_price,
            stockQuantity: data.stock_quantity,
            images: data.images || [data.product_image] || [],
            sku: data.sku,
            category: data.category_name,
            status: data.status,
            createdAt: new Date(data.created_at).toLocaleDateString('vi-VN'),
            updatedAt: new Date(data.updated_at).toLocaleDateString('vi-VN'),
            productType: data.product_type || 'physical',
            weight: data.weight,
            dimensions: data.dimensions,
            specifications: data.specifications || [],
            totalSales: data.total_sales || 0,
            rating: data.rating || 0,
            reviews: data.reviews || []
          };
          
          setProduct(formattedProduct);
        } else {
          setError("Không tìm thấy thông tin sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        toast.error("Lỗi khi tải thông tin sản phẩm: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleEditProduct = () => {
    navigate(`/vendor/product/edit/${productId}`);
  };

  const handleDeleteProduct = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
      try {
        await productService.deleteProduct(productId);
        toast.success("Xóa sản phẩm thành công");
        navigate("/vendor/products");
      } catch (error) {
        toast.error("Lỗi khi xóa sản phẩm: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const formatPrice = (price) => {
    return price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price) : 'N/A';
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/vendor/products')}
              className="mr-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
            >
              <FaArrowLeft className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-red-500">Lỗi</h1>
          </div>
          <p className="text-red-500">{error || "Không tìm thấy sản phẩm"}</p>
          <button 
            onClick={() => navigate('/vendor/products')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center mb-6 border-b pb-4">
          <button 
            onClick={() => navigate('/vendor/products')}
            className="mr-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold flex-grow">{product.name}</h1>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button 
              onClick={handleEditProduct}
              className="px-4 py-2 bg-blue-500 text-white rounded flex items-center hover:bg-blue-600 transition-colors"
            >
              <FaEdit className="mr-2" /> Chỉnh sửa
            </button>
            <button 
              onClick={handleDeleteProduct}
              className="px-4 py-2 bg-red-500 text-white rounded flex items-center hover:bg-red-600 transition-colors"
            >
              <FaTrashAlt className="mr-2" /> Xóa
            </button>
          </div>
        </div>

        {/* Product Image Gallery */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaImage className="mr-2 text-gray-600" /> Hình ảnh sản phẩm
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div key={index} className="border rounded-lg overflow-hidden h-48">
                  <img 
                    src={image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="border rounded-lg overflow-hidden h-48 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Không có hình ảnh</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaClipboardList className="mr-2 text-gray-600" /> Thông tin cơ bản
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID Sản phẩm</p>
                  <p className="font-medium">{product.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mã SKU</p>
                  <p className="font-medium">{product.sku || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Danh mục</p>
                  <p className="font-medium">{product.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
                        product.status === 'reviewing' ? 'bg-blue-100 text-blue-800' : 
                        product.status === 'violation' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {product.status === 'active' ? 'Đang bán' : 
                      product.status === 'reviewing' ? 'Đang xem xét' : 
                      product.status === 'violation' ? 'Vi phạm' : 'Chưa đăng bán'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loại sản phẩm</p>
                  <p className="font-medium capitalize">{product.productType || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2 text-gray-600" /> Thông tin giá & kho
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Giá bán</p>
                  <p className="font-medium text-lg text-green-600">{formatPrice(product.price)}</p>
                </div>
                {product.originalPrice && (
                  <div>
                    <p className="text-sm text-gray-500">Giá gốc</p>
                    <p className="font-medium line-through text-gray-500">{formatPrice(product.originalPrice)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Tồn kho</p>
                  <p className="font-medium">{product.stockQuantity} sản phẩm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Đã bán</p>
                  <p className="font-medium">{product.totalSales || 0} sản phẩm</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaThList className="mr-2 text-gray-600" /> Mô tả sản phẩm
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {product.description ? (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }}></div>
            ) : (
              <p className="text-gray-500">Không có mô tả</p>
            )}
          </div>
        </div>

        {/* Product Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaTag className="mr-2 text-gray-600" /> Thông số kỹ thuật
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{spec.name}:</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Physical Attributes */}
        {product.productType === 'physical' && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaBoxOpen className="mr-2 text-gray-600" /> Thông tin vận chuyển
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cân nặng</p>
                  <p className="font-medium">{product.weight ? `${product.weight} g` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kích thước (DxRxC)</p>
                  <p className="font-medium">
                    {product.dimensions || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Performance */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaChartBar className="mr-2 text-gray-600" /> Hiệu suất bán hàng
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Đánh giá trung bình</p>
                <div className="flex items-center mt-1">
                  <span className="text-lg font-medium mr-2">{product.rating.toFixed(1)}</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={i < Math.round(product.rating) ? "currentColor" : "none"} stroke="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số đánh giá</p>
                <p className="font-medium">{product.reviews.length || 0} đánh giá</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium">{product.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                <p className="font-medium">{product.updatedAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;