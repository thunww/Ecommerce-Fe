import React, { Component } from "react";

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [
        { title: "Complete 'Getting Started' Course", button: "Start" },
        { title: "Complete 'Selling on Shopee' Course", button: "Start" },
        { title: "Complete 'First Order Success' Course", button: "Start" },
      ],
    };
  }

  render() {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-3">Seller Tasks</h3>
        {this.state.tasks.map((task, index) => (
          <div key={index} className="flex justify-between items-center p-2 border-b">
            <span>{task.title}</span>
            <button className="bg-red-500 text-white px-3 py-1 rounded">
              {task.button}
            </button>
          </div>
        ))}
      </div>
    );
  }
}

export default TaskList;
