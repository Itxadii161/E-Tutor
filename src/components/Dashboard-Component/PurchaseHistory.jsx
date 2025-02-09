import React, { useState } from "react";

const PurchaseHistory = () => {
  // Sample purchase data (simulating a database)
  const [purchases] = useState([
    { id: 1, subject: "Mathematics", teacher: "Mr. Smith", classes: "Algebra 101", price: "$49", date: "2024-01-10", status: "Completed" },
    { id: 2, subject: "Science", teacher: "Dr. Brown", classes: "Physics Basics", price: "$79", date: "2024-02-01", status: "Pending" },
    { id: 3, subject: "English", teacher: "Ms. Davis", classes: "Literature Insights", price: "$99", date: "2024-01-15", status: "Completed" },
    { id: 4, subject: "History", teacher: "Mr. Johnson", classes: "World War II", price: "$89", date: "2024-02-05", status: "Failed" },
  ]);

  // Search filter state
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-6">Purchase History</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by subject, teacher, or class..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      />

      {/* Purchase List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Teacher</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases
              .filter((item) =>
                `${item.subject} ${item.teacher} ${item.classes}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((purchase) => (
                <tr key={purchase.id} className="border-t">
                  <td className="p-3">{purchase.subject}</td>
                  <td className="p-3">{purchase.teacher}</td>
                  <td className="p-3">{purchase.classes}</td>
                  <td className="p-3">{purchase.price}</td>
                  <td className="p-3">{purchase.date}</td>
                  <td
                    className={`p-3 font-bold ${
                      purchase.status === "Completed"
                        ? "text-green-600"
                        : purchase.status === "Pending"
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {purchase.status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseHistory;
