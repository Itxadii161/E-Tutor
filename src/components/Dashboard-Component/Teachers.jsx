import React from "react";
import t1 from '../../assets/Teachers-images/t-1.png'
import t2 from '../../assets/Teachers-images/t-2.png'
import t3 from '../../assets/Teachers-images/t-3.png'
import t4 from '../../assets/Teachers-images/t-4.png'
import t5 from '../../assets/Teachers-images/t-5.png'
import t6 from '../../assets/Teachers-images/t-6.png'
import t7 from '../../assets/Teachers-images/t-7.png'
import t8 from '../../assets/Teachers-images/t-8.png'
// import t1 from '../../assets/Teachers-images/t-1.png'
// import t1 from '../../assets/Teachers-images/t-1.png'
const teachersData = [
  { name: "Wade Warren", role: "Digital Product Designer", students: "236,856", rating: 5, image: t1 },
  { name: "Bessie Cooper", role: "Senior Developer", students: "211,434", rating: 4.2, image: t2 },
  { name: "Floyd Miles", role: "UI/UX Designer", students: "435,871", rating: 4.5, image: t3 },
  { name: "Ronald Richards", role: "Logo Developer", students: "1,236,326", rating: 4.8, image: t4 },
  { name: "Devon Lane", role: "Senior Developer", students: "854", rating: 4.8, image: t5 },
  { name: "Robert Fox", role: "UI/UX Designer", students: "197,857", rating: 4.2, image: t6 },
  { name: "Kathryn Murphy", role: "Adobe Instructor", students: "197,857", rating: 4.3, image: t7 },
  { name: "Jerome Bell", role: "Adobe Instructor", students: "2,371", rating: 4.8, image: t8 }
];

const Teachers = () => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Instructors ({teachersData.length})</h2>
      <input
        type="text"
        placeholder="Search in your teachers..."
        className="w-full p-2 border rounded-lg mb-4"
      />
      <div className="grid grid-cols-4 gap-6">
        {teachersData.map((teacher, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg text-center">
            <img
              src={teacher.image}
              alt={teacher.name}
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <p className="text-lg font-bold">{teacher.name}</p>
            <p className="text-gray-600">{teacher.role}</p>
            <p className="text-gray-500 text-sm">{teacher.students} students</p>
            <p className="text-yellow-500 font-bold">⭐ {teacher.rating}</p>
            <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
              Send Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teachers;
