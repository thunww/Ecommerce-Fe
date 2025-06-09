import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProducts } from "../../../../redux/productSilce";
import FilterSection from "./FilterSection";
import ProductListing from "../../../../pages/Customer/Pages/ProductListing";

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchResults, loading, error } = useSelector(
    (state) => state.products
  );

  // Hàm lấy các tham số tìm kiếm từ URL
  const getSearchParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      keyword: params.get("q") || "",
      categoryId: params.get("categoryId")
        ? params.get("categoryId").split(",")
        : [],
      minPrice: params.get("minPrice")
        ? Number(params.get("minPrice"))
        : undefined,
      maxPrice: params.get("maxPrice")
        ? Number(params.get("maxPrice"))
        : undefined,
      minRating: params.get("minRating") ? Number(params.get("minRating")) : 0,
      sort: params.get("sort") || "",
    };
  };

  // Gọi API khi URL thay đổi
  useEffect(() => {
    const { keyword, categoryId, minPrice, maxPrice, minRating, sort } =
      getSearchParams();

    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (!isNaN(min) && !isNaN(max) && min > max) {
      dispatch({
        type: "products/searchProducts/rejected",
        payload: "Giá tối thiểu không thể lớn hơn giá tối đa",
      });
      return;
    }

    const searchParams = {
      keyword,
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      sort,
    };

    const timer = setTimeout(() => {
      dispatch(searchProducts(searchParams));
    }, 300);

    return () => clearTimeout(timer);
  }, [location.search, dispatch]);

  // Khi người dùng thay đổi bộ lọc
  const handleFilter = (newParams) => {
    const params = new URLSearchParams(location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      const paramKey = key === "keyword" ? "q" : key;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(paramKey, value.join(","));
        } else {
          params.delete(paramKey);
        }
      } else if (value || value === 0) {
        // cho phép value = 0 (ví dụ minRating = 0)
        params.set(paramKey, value);
      } else {
        params.delete(paramKey);
      }
    });
    navigate(`/search?${params.toString()}`);
  };

  const filters = getSearchParams();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4">
          <FilterSection onFilter={handleFilter} filters={filters} />
        </aside>

        <main className="w-full md:w-3/4">
          {loading || error ? (
            <div className="bg-white p-6 rounded-lg min-h-[300px] flex items-center justify-center">
              {loading ? (
                <span className="text-gray-500 text-lg">Đang tải...</span>
              ) : (
                <span className="text-red-500 text-lg">{error}</span>
              )}
            </div>
          ) : (
            <ProductListing products={searchResults} />
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
