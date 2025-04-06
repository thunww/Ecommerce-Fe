import React, { useState, useEffect } from "react";
import QtyBox from "../QtyBox";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { GoGitCompare } from "react-icons/go";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../../../redux/productSilce";

const ProductDetailsComponent = ({ product }) => {
  const dispatch = useDispatch();
  console.log("ProductDetailsComponent:", product.product_id);

  const [selectedSize, setSelectedSize] = useState(null);

  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="product-details p-6 bg-white rounded-lg shadow-sm">
      {/* Product Title and Rating Section */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Ten San Pham 1
        </h1>

        <div className="flex items-center flex-wrap gap-4 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Brands:</span>
            <span className="font-medium text-gray-700">Brand 1</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm text-blue-600 hover:underline cursor-pointer ml-1">
              Reviews (5)
            </span>
            <Rating
              name="product-rating"
              defaultValue={4}
              size="small"
              readOnly
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* Price and Stock Section */}
      <div className="my-4">
        <div className="flex items-center gap-3">
          <span className="line-through text-gray-500 text-lg">$75.00</span>
          <span className="text-red-600 text-2xl font-bold">$55.00</span>
          <span className="ml-auto text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
            In Stock: <span className="font-bold">147</span> Items
          </span>
        </div>
      </div>

      {/* Product Description */}
      <div className="my-4">
        <p className="text-gray-700 leading-relaxed">
          Mo Ta Brands or San Pham. High-quality material, comfortable fit, and
          stylish design make this product perfect for everyday use.
        </p>
      </div>

      <Divider />

      {/* Size Selection */}
      <div className="my-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-gray-800 font-medium w-20">Size:</span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <Button
                key={size}
                variant={selectedSize === index ? "contained" : "outlined"}
                color="primary"
                onClick={() => setSelectedSize(index)}
                size="small"
                className={`min-w-10 ${
                  selectedSize === index
                    ? "!bg-red-500 !text-white"
                    : "border-gray-300"
                }`}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="flex items-center gap-4 my-6">
        <div className="w-24">
          <QtyBox />
        </div>

        <Button
          variant="contained"
          className="!bg-red-500 !text-white !px-6 !py-2 !normal-case !font-medium hover:!bg-red-600 flex items-center gap-2"
        >
          <MdOutlineShoppingCart className="text-xl" />
          Add to Cart
        </Button>
      </div>

      <Divider />

      {/* Wishlist and Compare */}
      <div className="flex items-center gap-6 mt-4">
        <button className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors">
          <FaRegHeart className="text-lg" />
          <span className="text-sm font-medium">Add to Wishlist</span>
        </button>

        <button className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors">
          <GoGitCompare className="text-lg" />
          <span className="text-sm font-medium">Add to Compare</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsComponent;
