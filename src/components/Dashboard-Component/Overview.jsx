import React from "react";

const Overview = () => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">120</p>
          <p className="text-gray-600">Total Students</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">35</p>
          <p className="text-gray-600">Live Sessions</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">50+</p>
          <p className="text-gray-600">Video Lessons</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">98%</p>
          <p className="text-gray-600">Satisfaction Rate</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
