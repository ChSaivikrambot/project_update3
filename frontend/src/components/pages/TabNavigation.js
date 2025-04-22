// TabNavigation.js
const TabNavigation = ({ activeTab, statusCounts, onChange }) => {
    const tabs = [
      { id: 'all', label: 'All' },
      { id: 'Present', label: 'Present' },
      { id: 'Absent', label: 'Absent' },
      { id: 'NotMarked', label: 'Not Marked' },
    ];
  
    return (
      <div className="flex border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 mr-1 font-medium ${
              activeTab === tab.id 
                ? 'border-b-2 border-indigo-500 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label} ({statusCounts[tab.id] || 0})
          </button>
        ))}
      </div>
    );
  };
  
  export default TabNavigation;