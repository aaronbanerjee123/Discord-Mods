import React from 'react';

const StudentAssignmentCard = ({ assignment }) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 mb-4 p-4 rounded border border-gray-300">
      <div>
        <h3 className="text-lg font-semibold text-black">{assignment.name}</h3>
        <p className="text-sm text-gray-600">Weightage: {assignment.weightage}</p>
        {/* You can add other properties from the assignment object here */}
      </div>
      <div className="flex">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2">Edit</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
      </div>
    </div>
  );
}

export default StudentAssignmentCard;