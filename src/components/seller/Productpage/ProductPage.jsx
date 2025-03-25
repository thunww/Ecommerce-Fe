import React, { useState, useEffect } from "react";
import ProductHeader from "./ProductHeader";
import ProductTabs from "./ProductTabs";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import NoProductFound from "./NoProductFound";

const ProductPage = ({ products = [], loading = false, error = null, onProductChanged }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    productType: ""
  });

  // Cập nhật danh sách sản phẩm đã lọc khi có thay đổi về products, filters hoặc activeTab
  useEffect(() => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let result = [...products];

    // Lọc theo tab
    if (activeTab !== "all") {
      result = result.filter(product => {
        switch(activeTab) {
          case "live":
            return product.status === "active";
          case "violation":
            return product.status === "violation";
          case "review":
            return product.status === "reviewing";
          case "unpublished":
            return product.status === "unpublished";
          default:
            return true;
        }
      });
    }

    // Lọc theo từ khóa tìm kiếm
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        (product.sku && product.sku.toLowerCase().includes(searchTerm))
      );
    }

    // Lọc theo danh mục
    if (filters.category) {
      result = result.filter(product => 
        product.category && product.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Lọc theo loại sản phẩm
    if (filters.productType) {
      result = result.filter(product => 
        product.type === filters.productType
      );
    }

    setFilteredProducts(result);
  }, [products, filters, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "",
      productType: ""
    });
  };

  // Tính toán số lượng sản phẩm cho mỗi tab
  const tabCounts = {
    all: products.length,
    live: products.filter(p => p.status === "active").length,
    violation: products.filter(p => p.status === "violation").length,
    review: products.filter(p => p.status === "reviewing").length,
    unpublished: products.filter(p => p.status === "unpublished").length
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <ProductHeader />
      
      <div className="bg-white rounded-lg shadow-sm mt-4">
        <ProductTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          counts={tabCounts}
        />
        
        <div className="p-4">
          <ProductFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onReset={handleResetFilters}
          />
          
          {loading ? (
            <div className="py-10 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">
              {error}
            </div>
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
    </div>
  );
};

export default ProductPage; 