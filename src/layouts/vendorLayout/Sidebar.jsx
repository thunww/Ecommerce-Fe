import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaBox, FaClipboardList, FaChartBar, FaUsers, FaDatabase, FaStore, FaChevronDown, FaChevronUp } from "react-icons/fa";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenu: null,
    };
  }

  toggleMenu(menu) {
    this.setState({ activeMenu: this.state.activeMenu === menu ? null : menu });
  }

  render() {
    return (
      <div className="w-64 h-screen bg-white shadow-lg p-4 flex flex-col text-gray-700 pt-16">
        <h2 className="text-xl font-bold text-red-600 mb-6">Owner</h2>
        <nav className="flex flex-col gap-2">
          
          {/* Order Management */}
          <div>
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => this.toggleMenu("orders")}
            >
              <div className="flex items-center gap-2">
                <FaClipboardList />
                <span>Order Management</span>
              </div>
              {this.state.activeMenu === "orders" ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {this.state.activeMenu === "orders" && (
              <div className="ml-6 flex flex-col text-sm text-gray-600">
                <Link to="orders" className="py-1 cursor-pointer hover:text-gray-800">All Orders</Link>
                <Link to="bulk-shipping" className="py-1 cursor-pointer hover:text-gray-800">Bulk Shipping</Link>
                <Link to="order-transfer" className="py-1 cursor-pointer hover:text-gray-800">Order Transfer</Link>
                <Link to="returns" className="py-1 cursor-pointer hover:text-gray-800">Returns & Cancellations</Link>
                <Link to="shipping-settings" className="py-1 cursor-pointer hover:text-gray-800">Shipping Settings</Link>
              </div>
            )}
          </div>

          {/* Product Management */}
          <div>
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => this.toggleMenu("products")}
            >
              <div className="flex items-center gap-2">
                <FaBox />
                <span>Product Management</span>
              </div>
              {this.state.activeMenu === "products" ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {this.state.activeMenu === "products" && (
              <div className="ml-6 flex flex-col text-sm text-gray-600">
                <Link to="products" className="py-1 cursor-pointer hover:text-gray-800">All Products</Link>
                <Link to="add-product" className="py-1 cursor-pointer hover:text-gray-800">Add New Product</Link>
              </div>
            )}
          </div>

          {/* Marketing */}
          <Link to="marketing" className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-100 rounded-md">
            <FaChartBar />
            <span>Marketing</span>
          </Link>

          {/* Customer Support */}
          <Link to="customer-support" className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-100 rounded-md">
            <FaUsers />
            <span>Customer Support</span>
          </Link>

          {/* Finance */}
          <div>
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => this.toggleMenu("finance")}
            >
              <div className="flex items-center gap-2">
                <FaChartBar />
                <span>Finance</span>
              </div>
              {this.state.activeMenu === "finance" ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {this.state.activeMenu === "finance" && (
              <div className="ml-6 flex flex-col text-sm text-gray-600">
                <Link to="revenue" className="py-1 cursor-pointer hover:text-gray-800">Revenue</Link>
                <Link to="shopee-balance" className="py-1 cursor-pointer hover:text-gray-800">Shopee Balance</Link>
                <Link to="bank-account" className="py-1 cursor-pointer hover:text-gray-800">Bank Account</Link>
              </div>
            )}
          </div>

          {/* Data */}
          <Link to="data" className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-100 rounded-md">
            <FaDatabase />
            <span>Data</span>
          </Link>

          {/* Shop Management */}
          <div>
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => this.toggleMenu("shop")}
            >
              <div className="flex items-center gap-2">
                <FaStore />
                <span>Shop Management</span>
              </div>
              {this.state.activeMenu === "shop" ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {this.state.activeMenu === "shop" && (
              <div className="ml-6 flex flex-col text-sm text-gray-600">
                <Link to="shop-profile" className="py-1 cursor-pointer hover:text-gray-800">Shop Profile</Link>
                <Link to="shop-decoration" className="py-1 cursor-pointer hover:text-gray-800">Shop Decoration</Link>
                <Link to="shop-settings" className="py-1 cursor-pointer hover:text-gray-800">Shop Settings</Link>
              </div>
            )}
          </div>

        </nav>
      </div>
    );
  }
}

export default Sidebar;
