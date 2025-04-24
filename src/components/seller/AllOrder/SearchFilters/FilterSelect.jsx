import React, { Component } from 'react';

class FilterSelect extends Component {
  render() {
    const { value, onChange } = this.props;

    return (
      <div className="relative flex-1 min-w-[200px]">
        <select 
          className="appearance-none w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded text-sm focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Shipping Carrier</option>
          <option value="All Carriers">All Carriers</option>
          <option value="GHN">GHN</option>
          <option value="GHTK">GHTK</option>
          <option value="Viettel Post">Viettel Post</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    );
  }
}

export default FilterSelect;
