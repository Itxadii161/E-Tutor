import React, { useState } from "react";
import Overview from "../components/Dashboard-Component/Overview";
import Teachers from "../components/Dashboard-Component/Teachers";
import Message from "../components/Dashboard-Component/Message";
import PurchaseHistory from "../components/Dashboard-Component/PurchaseHistory";
import Settings from "../components/Dashboard-Component/Settings";
import userImg from '../assets/Teachers-images/t-1.png'
const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState(<Overview />);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
            <div className="bg-white shadow-md rounded-xl p-6 flex justify-between items-center">
        <div>
        <img className=" w-20 rounded-full" src= {userImg} alt=""/>
          <h1 className="text-xl font-bold">Kevin Gilbert</h1>
          <p className="text-gray-600">Web Designer & Best-Selling Instructor</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          Become Instructor
        </button>
      </div>

      
      <div className="bg-white shadow-md rounded-xl mt-4 p-4 flex gap-6">
        <button
          onClick={() => setActiveComponent(<Overview />)}
          className={`pb-1 font-semibold ${activeComponent.type === Overview ? "border-b-2 border-black" : "text-gray-500"}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveComponent(<Teachers />)}
          className={`pb-1 font-semibold ${activeComponent.type === Teachers ? "border-b-2 border-black" : "text-gray-500"}`}
        >
          Teachers          
        </button>
        <button
          onClick={() => setActiveComponent(<Message />)}
          className={`pb-1 font-semibold ${activeComponent.type === Message ? "border-b-2 border-black" : "text-gray-500"}`}
        >
          Message
        </button>
        <button
          onClick={() => setActiveComponent(<PurchaseHistory />)}
          className={`pb-1 font-semibold ${activeComponent.type === PurchaseHistory ? "border-b-2 border-black" : "text-gray-500"}`}
        >
          Purchase History
        </button>
        <button
          onClick={() => setActiveComponent(<Settings />)}
          className={`pb-1 font-semibold ${activeComponent.type === Settings ? "border-b-2 border-black" : "text-gray-500"}`}
        >
          Settings
        </button>
      </div>

      {/* Dynamic Content Section */}
      <div className="mt-6">
        {activeComponent}
      </div>
    </div>
  );
};

export default Dashboard;
