import React, { Component } from 'react';
import HeaderActions from './HeaderActions';
import MainTabs from './MainTabs';
import StatusTabs from './StatusTabs';
import SearchFilters from './SearchFilters/SearchFilters';
import OrderSummary from './OrderSummary/OrderSummary';
import OrderTable from './OrderTable/OrderTable';

class OrderManagementContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'waiting-for-pickup',
      activeSubTab: 'unprocessed',
      searchOrderCode: '',
      shippingUnit: 'All Carriers',
      sortOption: 'Package Order (Farthest - Nearest)',
      orders: [] // Assuming no orders initially
    };
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleSubTabChange = (subTab) => {
    this.setState({ activeSubTab: subTab });
  };

  handleSearchChange = (field, value) => {
    this.setState({ [field]: value });
  };

  handleApplyFilters = () => {
    console.log('Applying filters');
  };

  handleResetFilters = () => {
    this.setState({
      searchOrderCode: '',
      shippingUnit: 'All Carriers'
    });
  };

  handleSortChange = (sortOption) => {
    this.setState({ sortOption });
  };

  handleBatchShipping = () => {
    console.log('Processing batch shipping');
  };

  render() {
    const { 
      activeTab, 
      activeSubTab, 
      searchOrderCode, 
      shippingUnit, 
      sortOption, 
      orders 
    } = this.state;

    return (
        <div className="bg-white p-4 rounded-lg shadow w-full max-w-50xl mx-auto h-[800px]">

        <HeaderActions />
        
        <MainTabs 
          activeTab={activeTab} 
          onTabChange={this.handleTabChange} 
        />
        
        <StatusTabs 
          activeSubTab={activeSubTab} 
          onSubTabChange={this.handleSubTabChange} 
        />
        
        <SearchFilters 
          searchOrderCode={searchOrderCode}
          shippingUnit={shippingUnit}
          onSearchChange={this.handleSearchChange}
          onApplyFilters={this.handleApplyFilters}
          onResetFilters={this.handleResetFilters}
        />
        
        <OrderSummary 
          orderCount={orders.length}
          sortOption={sortOption}
          onSortChange={this.handleSortChange}
          onBatchShipping={this.handleBatchShipping}
        />
        
        <OrderTable orders={orders} />
      </div>
    );
  }
}

export default OrderManagementContainer;
