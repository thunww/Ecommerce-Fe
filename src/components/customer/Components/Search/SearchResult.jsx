import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../../../../redux/productSilce";
import ProductListing from "../../../../pages/Customer/Pages/ProductListing";

const SearchResults = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");

  const { searchResults, loading, error } = useSelector(
    (state) => state.products
  );
  const { products = [] } = useSelector((state) => state.products);

  const activeProducts = products.filter(
    (product) => product.status === "active"
  );

  useEffect(() => {
    if (query) {
      dispatch(searchProducts({ keyword: query }));
    }
  }, [dispatch, query]);

  return (
    <div className="p-1">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && searchResults.length === 0 && (
        <div>
          <ProductListing
            products={activeProducts}
            loading={loading}
            error={error}
          />
        </div>
      )}

      {!loading && searchResults.length > 0 && (
        <ProductListing
          products={searchResults}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default SearchResults;
