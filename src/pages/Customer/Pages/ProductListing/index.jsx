import React, { useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";
import ProductItem from "../../../../components/customer/Components/ProductItem";

const ProductListing = () => {
  const {
    searchResults: products = [],
    loading,
    error,
  } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Kiểm tra products là mảng
  const activeProducts = Array.isArray(products)
    ? products.filter((product) => product.status === "active")
    : [];

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = activeProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-2">
      <div className="bg-white p-4 mt-2 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.length ? (
            currentProducts.map((product) => (
              <ProductItem key={product.product_id} product={product} />
            ))
          ) : (
            <div className="text-center text-gray-500 col-span-full py-10">
              Không tìm thấy sản phẩm
            </div>
          )}
        </div>

        {/* Pagination */}
        {products.length > productsPerPage && (
          <div className="flex justify-center mt-6">
            <Pagination
              count={Math.ceil(products.length / productsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductListing;
