import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import ProductItem from "../../../../components/customer/Components/ProductItem";
import { getProductRelated } from "../../../../redux/productSilce";

const RelatedProducts = ({ categoryId, currentProductId }) => {
  const dispatch = useDispatch();

  const { relatedProducts, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (categoryId && relatedProducts.length === 0) {
      dispatch(getProductRelated(categoryId));
    }
  }, [dispatch, categoryId, relatedProducts.length]);

  const filteredRelated = relatedProducts.filter(
    (product) =>
      product.status === "active" && product.product_id !== currentProductId
  );

  return (
    <div className="mt-8">
      <Typography variant="h6" className="mb-4">
        Related Products
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredRelated.length === 0 ? (
        <Typography>No related products found.</Typography>
      ) : (
        <div className="product-list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredRelated
            .sort(() => Math.random() - 0.5)
            .slice(0, 6)
            .map((product) => (
              <ProductItem key={product.product_id} product={product} />
            ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
