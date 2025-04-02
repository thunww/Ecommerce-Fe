import React, { useState, useEffect } from "react";
import ProductHeader from "./ProductHeader.jsx";
import ProductTabs from "./ProductTabs.jsx";
import ProductFilters from "./ProductFilters.jsx";
import ProductTable from "./ProductTable.jsx";
import NoProductFound from "./NoProductFound.jsx";

const ProductPage = ({ products = [], loading = false, error = null, onProductChanged }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all"
  });

  useEffect(() => {
    // Lọc sản phẩm dựa trên tab và bộ lọc
    let filtered = [...products];

    // Lọc theo tab
    if (activeTab !== "all") {
      filtered = filtered.filter(product => product.status === activeTab);
    }

    // Lọc theo từ khóa tìm kiếm
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower)
      );
    }

    // Lọc theo danh mục
    if (filters.category !== "all") {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Lọc theo loại sản phẩm
    if (filters.type !== "all") {
      filtered = filtered.filter(product => product.type === filters.type);
    }

    setFilteredProducts(filtered);
  }, [products, activeTab, filters]);

  // Xử lý khi tab thay đổi
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Xử lý khi bộ lọc thay đổi
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <ProductHeader />
      
      <div className="flex-1 p-6">
        <ProductTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          productCounts={{
            all: products.length,
            active: products.filter(p => p.status === 'active').length,
            inactive: products.filter(p => p.status === 'inactive').length,
            outOfStock: products.filter(p => p.stock === 0).length,
            violation: products.filter(p => p.status === 'violation').length
          }}
        />

        <ProductFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
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