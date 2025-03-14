import React, { Component } from 'react';

class SortOptions extends Component {
  render() {
    const { value, onChange } = this.props;
    
    return (
      <>
        <span className="text-sm text-gray-500 mr-2">Sort by:</span>
        <select 
          className="text-sm bg-white border border-gray-300 px-2 py-1 rounded mr-2 focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="Packing order (Farthest - Nearest)">Packing order (Farthest - Nearest)</option>
          <option value="Packing order (Nearest - Farthest)">Packing order (Nearest - Farthest)</option>
          <option value="Time (Newest - Oldest)">Time (Newest - Oldest)</option>
          <option value="Time (Oldest - Newest)">Time (Oldest - Newest)</option>
        </select>
      </>
    );
  }
}

export default SortOptions;
