import React, { Component } from 'react';

class BatchActionButton extends Component {
  render() {
    const { onClick } = this.props;
    
    return (
      <button 
        className="bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center"
        onClick={onClick}
      >
        <span className="mr-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </span>
        Mass Delivery
      </button>
    );
  }
}

export default BatchActionButton;