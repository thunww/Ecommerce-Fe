import { useEffect, useState } from "react";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "./Service/productService";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import Table from "../../components/common/Table"; 

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    getProducts();
  }, []);

  const handleAddProduct = async () => {
    const newProduct = { name: "New Product", price: 100000, stock: 10 };
    const addedProduct = await addProduct(newProduct);
    setProducts([...products, addedProduct]);
  };

  const handleUpdateProduct = async (id) => {
    await updateProduct(id, { name: "Updated Product" });
    setProducts(products.map((product) => (product.id === id ? { ...product, name: "Updated Product" } : product)));
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    setProducts(products.filter((product) => product.id !== id));
  };

  const filteredProducts = products.filter((product) =>
    search === "" || product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="text-center text-lg font-semibold text-gray-500">Loading products...</p>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800">Product Management</h2>
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-5 py-3 rounded-lg flex items-center hover:bg-green-600 transition-all"
          >
            <FaPlus className="mr-2" /> Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-200 p-4 rounded-lg mb-6 shadow-sm w-full">
          <FaSearch className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-800 text-lg"
          />
        </div>

        {/* Table Component */}
        <Table
          columns={[
            { header: "ID", field: "id" },
            { header: "Name", field: "name" },
            { header: "Price", field: "price", render: (value) => `${value.toLocaleString()}đ` },
            { header: "Stock", field: "stock" },
          ]}
          data={filteredProducts}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ManageProducts;
