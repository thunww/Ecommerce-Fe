import React, { Component } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

class SellerTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedTasks: new Set(), // Lưu trữ các task đã hoàn thành
    };
  }

  handleStartTask = (task) => {
    // Tạo một bản sao của completedTasks
    const newCompletedTasks = new Set(this.state.completedTasks);
    
    // Thêm task vào danh sách hoàn thành
    newCompletedTasks.add(task);
    
    // Cập nhật state
    this.setState({ completedTasks: newCompletedTasks });
  };

  render() {
    const tasks = [
      "Complete the Beginner Course",
      "Finish the Shopee Selling Course",
      "Successfully Deliver an Order",
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Seller Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-2 bg-green-100 text-green-700 rounded-md mb-2">
            ✅ You have completed {this.state.completedTasks.size} task{this.state.completedTasks.size !== 1 ? 's' : ''}!{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">View Rewards</span>
          </div>
          {tasks.map((task, index) => (
            <div key={index} className="border p-2 rounded-md mb-2 flex justify-between items-center">
              <span className="flex items-center">
                {this.state.completedTasks.has(task) && (
                  <span className="text-green-500 mr-2">✓</span>
                )}
                {task}
              </span>
              {!this.state.completedTasks.has(task) ? (
                <button 
                  onClick={() => this.handleStartTask(task)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                >
                  Start
                </button>
              ) : (
                <span className="text-green-500 font-semibold">Completed</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
}

export default SellerTasks;