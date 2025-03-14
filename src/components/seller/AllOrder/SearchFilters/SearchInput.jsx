import React, { Component } from 'react';

class SearchInput extends Component {
  render() {
    const { value, onChange } = this.props;

    return (
      <div className="flex">
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 px-3 py-2 pr-8 rounded-l text-sm focus:outline-none">
            <option>Order Code</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <input
          type="text"
          placeholder="Enter Order Code"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border border-gray-300 border-l-0 px-3 py-2 text-sm rounded-r focus:outline-none"
        />
      </div>
    );
  }
}

export default SearchInput;
