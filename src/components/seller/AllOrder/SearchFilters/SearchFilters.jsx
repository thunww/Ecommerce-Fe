import React, { Component } from 'react';
import SearchInput from './SearchInput';
import FilterSelect from './FilterSelect';
import ActionButtons from './ActionButtons';

class SearchFilters extends Component {
  render() {
    const { 
      searchOrderCode, 
      shippingUnit, 
      onSearchChange, 
      onApplyFilters, 
      onResetFilters 
    } = this.props;

    return (
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <SearchInput 
          value={searchOrderCode} 
          onChange={(value) => onSearchChange('searchOrderCode', value)} 
        />
        
        <FilterSelect 
          value={shippingUnit} 
          onChange={(value) => onSearchChange('shippingUnit', value)} 
        />
        
        <ActionButtons 
          onApply={onApplyFilters} 
          onReset={onResetFilters} 
        />
      </div>
    );
  }
}

export default SearchFilters;