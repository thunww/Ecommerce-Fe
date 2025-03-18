import React, { Component } from "react";
import { getRevenue, getAllOrders } from "../../../services/vendorService";

class SalesAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revenue: 0,
      visits: 0,
      views: 0,
      orders: 0,
      conversionRate: 0.0,
    };
  }

  async componentDidMount() {
    try {
      const revenue = await getRevenue();
      const ordersData = await getAllOrders();
      
      const totalOrders = ordersData.orders.length;
      const visits = 5000; // Dữ liệu giả định, có thể lấy từ backend
      const views = 12000; // Dữ liệu giả định, có thể lấy từ backend
      const conversionRate = totalOrders > 0 ? ((totalOrders / visits) * 100).toFixed(2) : 0.0;

      this.setState({
        revenue,
        visits,
        views,
        orders: totalOrders,
        conversionRate,
      });
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Sales Analytics:", error);
    }
  }

  render() {
    const { revenue, visits, views, orders, conversionRate } = this.state;

    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold text-lg">Sales Analytics</h2>
        <div className="grid grid-cols-5 text-center">
          <div>
            <p className="text-xl font-bold">₫{revenue.toLocaleString()}</p>
            <p>Revenue</p>
          </div>
          <div>
            <p className="text-xl font-bold">{visits.toLocaleString()}</p>
            <p>Visits</p>
          </div>
          <div>
            <p className="text-xl font-bold">{views.toLocaleString()}</p>
            <p>Views</p>
          </div>
          <div>
            <p className="text-xl font-bold">{orders.toLocaleString()}</p>
            <p>Orders</p>
          </div>
          <div>
            <p className="text-xl font-bold">{conversionRate}%</p>
            <p>Conversion Rate</p>
          </div>
        </div>
      </div>
    );
  }
}

export default SalesAnalytics;
