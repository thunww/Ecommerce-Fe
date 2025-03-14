import React, { Component } from "react";

class ToDoList extends Component {
  render() {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold text-lg">To-Do List</h2>
        <div className="grid grid-cols-4 text-center">
          <div>
            <p className="text-blue-500 text-2xl font-bold">0</p>
            <p>Orders to Process</p>
          </div>
          <div>
            <p className="text-blue-500 text-2xl font-bold">0</p>
            <p>Processed</p>
          </div>
          <div>
            <p className="text-blue-500 text-2xl font-bold">0</p>
            <p>Return Requests</p>
          </div>
          <div>
            <p className="text-blue-500 text-2xl font-bold">0</p>
            <p>Restricted Products</p>
          </div>
        </div>
      </div>
    );
  }
}

export default ToDoList;
