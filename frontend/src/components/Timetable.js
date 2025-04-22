import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const getColorBySubject = (subject) => {
  const colors = {
    Math: "bg-red-100 text-red-800",
    Physics: "bg-blue-100 text-blue-800",
    Chemistry: "bg-green-100 text-green-800",
    English: "bg-purple-100 text-purple-800",
    Programming: "bg-yellow-100 text-yellow-800",
  };
  return colors[subject] || "bg-gray-100 text-gray-800";
};

const Timetable = () => {
  const todayName = new Date().toLocaleString("en-US", { weekday: "long" });
  const [day, setDay] = useState("All");
  const [department, setDepartment] = useState("CSE");
  const [section, setSection] = useState("PS-21");
  const [year, setYear] = useState("2nd Year");
  const [periodFilter, setPeriodFilter] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [collapsedDays, setCollapsedDays] = useState([]);

  const token = localStorage.getItem("token");
  const allWeekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const selectedDays = day === "All" ? allWeekDays : [day];

  const fetchTimetable = async () => {
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    setLoading(true);
    let results = [];

    try {
      for (const d of selectedDays) {
        const res = await axios.get(
          `/api/timetable/student?department=${department}&section=${section}&year=${year}&day=${d}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dataWithDay = res.data.timetable.map((item) => ({ ...item, day: d }));
        results = [...results, ...dataWithDay];
      }

      results.sort((a, b) => (a.Period || a.period) - (b.Period || b.period));
      setTimetable(results);
      setError("");
    } catch (err) {
      setTimetable([]);
      setError(err.response?.data?.msg || "Error fetching timetable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [day, department, section, year]);

  const sectionOptions = {
    CSE: ["PS-21", "PS-22", "PS-23", "PS-24"],
    IT: ["PS-1"],
    AIML: ["PS-21", "PS-22"],
  };

  const toggleCollapse = (d) => {
    setCollapsedDays((prev) =>
      prev.includes(d) ? prev.filter((day) => day !== d) : [...prev, d]
    );
  };

  const filteredTimetable = periodFilter
    ? timetable.filter((entry) => String(entry.Period || entry.period) === periodFilter)
    : timetable;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`${department} - ${section} ${year} Timetable`, 14, 15);
    let finalY = 25;

    allWeekDays.forEach((d) => {
      const dataForDay = filteredTimetable.filter((entry) => entry.day === d);
      if (dataForDay.length > 0) {
        doc.text(`${d}`, 14, finalY + 5);
        doc.autoTable({
          head: [["Period", "Subject", "Teacher", "Classroom"]],
          body: dataForDay.map((entry) => [
            entry.Period || entry.period,
            entry.Subject || entry.subject,
            entry.TeacherName || entry.teacherName,
            entry.Classroom || entry.classroom,
          ]),
          startY: finalY + 10,
          theme: "grid",
        });
        finalY = doc.lastAutoTable.finalY + 10;
      }
    });

    doc.save(`${department}_${section}_${year}_${day}_Timetable.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">📚 Student Timetable</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
        <select className="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="AIML">AIML</option>
        </select>

        <select className="select" value={section} onChange={(e) => setSection(e.target.value)}>
          {sectionOptions[department].map((sec) => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>

        <select className="select" value={year} onChange={(e) => setYear(e.target.value)}>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
        </select>

        <select className="select" value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="All">All</option>
          {allWeekDays.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select className="select" value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
          <option value="">All Periods</option>
          {[1, 2, 3, 4, 5].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </div>

      {/* Timetable Display */}
      {loading ? (
        <p className="text-center">⏳ Loading timetable...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {allWeekDays.map((d) => {
            const dayEntries = filteredTimetable.filter((entry) => entry.day === d);
            if (day !== "All" && d !== day) return null;
            return (
              <div key={d} className="border rounded shadow">
                <button
                  onClick={() => toggleCollapse(d)}
                  className={`w-full text-left px-4 py-2 font-semibold ${d === todayName ? "bg-yellow-200" : "bg-gray-100"}`}
                >
                  {collapsedDays.includes(d) ? "▶" : "▼"} {d}
                </button>

                {!collapsedDays.includes(d) && dayEntries.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border px-3 py-2">Period</th>
                          <th className="border px-3 py-2">Subject</th>
                          <th className="border px-3 py-2">Teacher</th>
                          <th className="border px-3 py-2">Classroom</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayEntries.map((entry, idx) => {
                          const subject = entry.Subject || entry.subject;
                          return (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="border px-3 py-2">{entry.Period || entry.period}</td>
                              <td
                                className={`border px-3 py-2 ${getColorBySubject(subject)}`}
                                title={`Subject: ${subject}`}
                              >
                                {subject}
                              </td>
                              <td className="border px-3 py-2" title={entry.TeacherName || entry.teacherName}>
                                {entry.TeacherName || entry.teacherName}
                              </td>
                              <td className="border px-3 py-2" title={entry.Classroom || entry.classroom}>
                                {entry.Classroom || entry.classroom}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Timetable;
