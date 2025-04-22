const BulkActions = ({ onMarkAll }) => (
    <div className="flex space-x-2">
      <button 
        onClick={() => onMarkAll('Present')} 
        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors duration-200"
      >
        Mark All Present
      </button>
      <button 
        onClick={() => onMarkAll('Absent')} 
        className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full hover:bg-red-200 transition-colors duration-200"
      >
        Mark All Absent
      </button>
    </div>
  );
  
  export default BulkActions;