// StudentList.js
import React from 'react';

const StudentList = ({ students, isMobile, onStatusChange }) => {
  if (students.length === 0) {
    return <div className="text-center text-gray-500 py-4">No students found</div>;
  }

  return (
    <div className="space-y-2">
      {students.map(student => (
        <div 
          key={student.studentId}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <div className="font-medium">{student.name}</div>
            <div className="text-sm text-gray-500">{student.studentId}</div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusChange(student.studentId, 'Present')}
              className={`px-3 py-1 rounded-md ${
                student.status === 'Present' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {isMobile ? 'P' : 'Present'}
            </button>
            <button
              onClick={() => onStatusChange(student.studentId, 'Absent')}
              className={`px-3 py-1 rounded-md ${
                student.status === 'Absent' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isMobile ? 'A' : 'Absent'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
