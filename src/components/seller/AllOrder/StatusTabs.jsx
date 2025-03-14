import React, { Component } from 'react';

class StatusTabs extends Component {
  render() {
    const { activeSubTab, onSubTabChange } = this.props;
    
    const subTabs = [
      { id: 'unprocessed', label: 'Unprocessed' },
      { id: 'processed', label: 'Processed' },
    ];

    return (
      <div className="mt-4 flex items-center text-sm">
        <span className="mr-4 text-gray-700">Order Status</span>
        
        <div className="flex space-x-2">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-1 rounded-full ${
                activeSubTab === tab.id
                  ? 'bg-orange-100 text-orange-500 border border-orange-500'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => onSubTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default StatusTabs;
