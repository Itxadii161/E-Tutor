const TutorCard = ({ tutor }) => {
  return (
    <div className="border rounded-lg shadow-lg p-5  bg-gray-100 flex flex-col items-center ">
      <img 
        src={tutor.image} 
        alt={`${tutor.name}'s profile`} 
        className="w-20 h-20 rounded-full mx-auto mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800">{tutor.name}</h3>
        <p>{tutor.fassion}</p>
      <p className="text-sm text-yellow-500 font-medium mt-2">
        Rating: {tutor.rating} ⭐
      </p>
      <p className="text-gray-600">{tutor.students}</p>
    </div>
  );
};

export default TutorCard;
