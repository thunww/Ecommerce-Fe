import React, { useState, useEffect } from "react";
import ProductHeader from "./ProductHeader.jsx";
import ProductTabs from "./ProductTabs.jsx";
import ProductFilters from "./ProductFilters.jsx";
import ProductTable from "./ProductTable.jsx";
import NoProductFound from "./NoProductFound.jsx";

const ProductPage = ({
  products = [],
  loading = false,
  error = null,
  onProductChanged,
  categories = [],
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
  });

  useEffect(() => {
    let filtered = [...products];
    console.log("Initial products:", filtered);

    // Lọc theo tab
    if (activeTab === "outOfStock") {
      filtered = filtered.filter((product) => {
        console.log(
          `Product ${product.name}: stock=${product.stock}, sales=${product.sales}`
        );
        return parseInt(product.stock) === parseInt(product.sales);
      });
    } else if (activeTab === "active") {
      filtered = filtered.filter((product) => product.status === "active");
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((product) => product.status === "inactive");
    }

    // Lọc theo từ khóa tìm kiếm
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.sku && product.sku.toLowerCase().includes(searchLower))
      );
    }

    // Lọc theo danh mục
    if (filters.category !== "all") {
      console.log("Filtering by category:", filters.category);
      filtered = filtered.filter(
        (product) => product.category_id === parseInt(filters.category)
      );
      console.log("Products after category filter:", filtered);
    }

    // Lọc theo loại sản phẩm
    if (filters.type !== "all") {
      console.log("Filtering by type:", filters.type);
      filtered = filtered.filter((product) => {
        const productType = product.type?.toLowerCase() || "physical";
        console.log(`Product ${product.name} type:`, productType);
        return productType === filters.type.toLowerCase();
      });
      console.log("Products after type filter:", filtered);
    }

    setFilteredProducts(filtered);
  }, [products, activeTab, filters]);

  // Xử lý khi tab thay đổi
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Xử lý khi bộ lọc thay đổi
  const handleFilterChange = (newFilters) => {
    console.log("Filter changed:", newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Tính toán số lượng sản phẩm cho mỗi tab
  const productCounts = {
    all: products.length,
    active: products.filter((p) => p.status === "active").length,
    inactive: products.filter((p) => p.status === "inactive").length,
    outOfStock: products.filter((p) => parseInt(p.stock) === parseInt(p.sales))
      .length,
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <ProductHeader />

      <div className="flex-1 p-6">
        <ProductTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          productCounts={productCounts}
        />

        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
        />

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : filteredProducts.length > 0 ? (
          <ProductTable
            products={filteredProducts}
            onProductChanged={onProductChanged}
          />
        ) : (
          <NoProductFound />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
