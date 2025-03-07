import { useEffect, useState } from "react";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "./Service/productService";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";

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

  const handleUpdateProduct = async (id, updatedData) => {
    await updateProduct(id, updatedData);
    setProducts(products.map((product) => (product.id === id ? { ...product, ...updatedData } : product)));
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition-all"
          >
            <FaPlus className="mr-2" /> Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-200 p-3 rounded-lg mb-6 shadow-sm">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-800"
          />
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-5 text-left text-lg">ID</th>
                <th className="p-5 text-left text-lg">Name</th>
                <th className="p-5 text-left text-lg">Price</th>
                <th className="p-5 text-left text-lg">Stock</th>
                <th className="p-5 text-center text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-b hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-5">{product.id}</td>
                  <td className="p-5 font-semibold text-gray-800">{product.name}</td>
                  <td className="p-5 text-blue-600 font-bold">{product.price.toLocaleString()}đ</td>
                  <td className="p-5 text-gray-600">{product.stock}</td>
                  <td className="p-5 text-center flex justify-center gap-3">
                    <button
                      onClick={() => handleUpdateProduct(product.id, { name: product.name })}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-all"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
