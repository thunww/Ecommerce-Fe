import React, { Component } from 'react';

class ActionButtons extends Component {
  render() {
    const { onApply, onReset } = this.props;

    return (
      <>
        <button 
          className="bg-orange-500 text-white px-4 py-2 rounded text-sm"
          onClick={onApply}
        >
          Apply
        </button>
        <button 
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm"
          onClick={onReset}
        >
          Reset
        </button>
      </>
    );
  }
}

export default ActionButtons;
