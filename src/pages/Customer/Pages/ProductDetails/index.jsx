import React, { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import ProductDetailsComponent from "../../../../components/customer/Components/ProductDetails";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../../../redux/productSilce";
import ShopInfoOfProduct from "./ShopInfoOfProduct";
import RelatedProducts from "../../../../components/customer/Components/ProductRelated";

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState(0);
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
              to="/fashion"
              className="link transition !text-[14px]"
            >
              Fashion
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
        <div className="container">
          <div className="productContent px-5">
            <ProductDetailsComponent />
            <ShopInfoOfProduct />

            {/* ✅ Related Products */}
            <RelatedProducts
              categoryId={product?.category_id}
              currentProductId={product?.product_id}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
