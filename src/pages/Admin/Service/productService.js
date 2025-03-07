const mockProducts = [
    { id: 1, name: "Laptop ASUS", price: 15000000, stock: 10 },
    { id: 2, name: "iPhone 14", price: 22000000, stock: 5 },
    { id: 3, name: "Samsung Galaxy S23", price: 18000000, stock: 8 },
    { id: 4, name: "Sony Headphones", price: 3000000, stock: 15 },
  ];
  
  export const fetchProducts = async () => {
    return new Promise((resolve) => setTimeout(() => resolve(mockProducts), 500));
  };
  
  export const addProduct = async (product) => {
    return new Promise((resolve) => {
      const newProduct = { id: mockProducts.length + 1, ...product };
      mockProducts.push(newProduct);
      setTimeout(() => resolve(newProduct), 500);
    });
  };
  
  export const updateProduct = async (id, updatedData) => {
    return new Promise((resolve) => {
      const index = mockProducts.findIndex((product) => product.id === id);
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...updatedData };
        setTimeout(() => resolve(mockProducts[index]), 500);
      } else {
        resolve(null);
      }
    });
  };
  
  export const deleteProduct = async (id) => {
    return new Promise((resolve) => {
      const index = mockProducts.findIndex((product) => product.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        setTimeout(() => resolve(true), 500);
      } else {
        resolve(false);
      }
    });
  };
  