import React, { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import ProductDetailsComponent from "../../../../components/customer/Components/ProductDetails";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../../../redux/productSilce";
import ShopInfoOfProduct from "./ShopInfoOfProduct";
import RelatedProducts from "../../../../components/customer/Components/ProductRelated";
import ProductReviewSection from "./ProductReviewSection";

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="py-5">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              to="/"
              className="link transition !text-[14px]"
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              to={`/category/${product?.category_id}`}
              className="link transition !text-[14px]"
            >
              {product?.Category?.category_name}
            </Link>
            <Link
              underline="hover"
              color="inherit"
              to={`/product/${id}`}
              className="link transition !text-[14px]"
            >
              {product?.product_name}
            </Link>
          </Breadcrumbs>
        </div>
      </div>
      <section className="bg-white py-5">
        <div className="container mx-auto">
          <div className="productContent px-5 space-y-10">
            {/* ✅ Chi tiết sản phẩm */}
            <div className="product-details">
              <ProductDetailsComponent
                product={product}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
              />
            </div>

            {/* ✅ Thông tin shop */}
            <div className="shop-info border-t pt-6">
              <ShopInfoOfProduct />
            </div>

            {/* ✅ Sản phẩm liên quan */}
            <div className="related-products pt-6">
              <RelatedProducts
                categoryId={product?.category_id}
                currentProductId={product?.product_id}
              />
            </div>

            {/* ✅ Đánh giá sản phẩm */}
            <div className="product-reviews border-t pt-6">
              <div className="review-wrapper bg-gray-50 p-4 rounded-md shadow-sm">
                <ProductReviewSection productId={product?.product_id} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
