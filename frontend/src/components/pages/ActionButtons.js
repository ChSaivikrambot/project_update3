// ActionButtons.js
const ActionButtons = ({ isSubmitted, onClear, onSubmit }) => (
    <div className="flex justify-end space-x-4 mt-6">
      <button
        onClick={onClear}
        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
      >
        Clear
      </button>
      <button
        onClick={onSubmit}
        disabled={isSubmitted}
        className={`px-4 py-2 text-white rounded-md ${
          isSubmitted 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        Submit Attendance
      </button>
    </div>
  );
  
  export default ActionButtons;