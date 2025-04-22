// StatsGrid.js
const StatsGrid = ({ statusCounts, total }) => {
    const stats = [
      { label: 'Total Students', value: total, color: 'bg-indigo-100', text: 'text-indigo-800' },
      { label: 'Present', value: statusCounts.Present, color: 'bg-green-100', text: 'text-green-800' },
      { label: 'Absent', value: statusCounts.Absent, color: 'bg-red-100', text: 'text-red-800' },
      { label: 'Not Marked', value: statusCounts.NotMarked, color: 'bg-yellow-100', text: 'text-yellow-800' },
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg ${stat.color}`}>
            <div className="text-sm font-medium">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.text}`}>{stat.value}</div>
          </div>
        ))}
      </div>
    );
  };
  
  export default StatsGrid;