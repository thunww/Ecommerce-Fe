import React from "react";
import Button from "../../seller/DashboardPage/ui/button";
import { MegaphoneIcon } from "lucide-react";

const Campaigns = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <h2 className="font-bold text-lg mb-4">Campaigns</h2>
      <div className="flex flex-col items-center justify-center py-8 text-gray-500 max-w-md mx-auto">
        <MegaphoneIcon className="w-12 h-12 mb-3 text-gray-400" />
        <p>No campaigns are currently available</p>
        <Button
          variant="outline"
          className="mt-4 text-white bg-red-500 border-red-500 hover:bg-red-600 px-4 py-2 rounded w-full sm:w-auto"
        >
          View Recommended Campaigns
        </Button>
      </div>
      <div className="text-right pb-4">
        
      </div>
    </div>
  );
};

export default Campaigns;
