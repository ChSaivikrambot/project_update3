import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGraduationCap, FaChalkboardTeacher } from "react-icons/fa";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";  // Corrected import
import 'react-tooltip/dist/react-tooltip.css';  // Add this import to use Tooltip styles
import Flag from "react-world-flags";

const Card = ({ icon, title, description, color, onClick }) => (
  <motion.article
    whileHover={{ y: -6, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex-1 p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md cursor-pointer transition-all"
    onClick={onClick}
    role="button"
    aria-label={`Continue as ${title}`}
  >
    <div className="space-y-5 text-center">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto"
        style={{ backgroundColor: color.bg, color: color.icon }}
      >
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="mt-4 w-full py-3 rounded-xl font-semibold transition-all shadow hover:shadow-lg text-white"
        style={{ backgroundColor: color.button }}
      >
        Continue →
      </motion.button>
    </div>
  </motion.article>
);

const UserSelection = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const fadeUp = (delay = 0.2) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
  };

  const getFlagCode = (lang) => {
    switch (lang) {
      case "en":
        return "US";
      case "hi":
        return "IN";
      default:
        return "UN";
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-4 sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-blue-400 flex items-center gap-2">
          📘 AttendEase
        </h1>
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            data-tip={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            data-tip="Switch Language"
          >
            <Flag code={getFlagCode(i18n.language)} style={{ width: 20, height: 15 }} />
            <span className="text-sm font-medium hidden sm:inline">
              {i18n.language.toUpperCase()}
            </span>
          </button>
        </div>
      </header>
      <Tooltip effect="solid" />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div {...fadeUp(0.1)} className="max-w-4xl space-y-4 sm:space-y-6 mb-10 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
            {t("welcome")}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            {t("SelectRoleDescription{Choose your role}")}
          </p>
        </motion.div>

        {/* Role Cards */}
        <motion.section
          {...fadeUp(0.2)}
          className="flex flex-col md:flex-row gap-6 w-full max-w-5xl mb-16"
        >
          <Card
            icon={<FaGraduationCap className="text-3xl sm:text-4xl" />}
            title={t("student")}
            description={t("trackAttendance")}
            color={{
              bg: "rgba(224, 231, 255, 0.5)",
              icon: "#6366F1",
              button: "#6366F1",
              hover: "#4F46E5",
            }}
            onClick={() => navigate("/login?role=student")}
          />
          <Card
            icon={<FaChalkboardTeacher className="text-3xl sm:text-4xl" />}
            title={t("teacher")}
            description={t("manageAttendance")}
            color={{
              bg: "rgba(219, 234, 254, 0.5)",
              icon: "#3B82F6",
              button: "#3B82F6",
              hover: "#2563EB",
            }}
            onClick={() => navigate("/login?role=teacher")}
          />
        </motion.section>

        {/* Features */}
        <motion.section {...fadeUp(0.3)} className="text-center space-y-12 w-full max-w-6xl">
          <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
            Key Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: "📊",
                title: "Real-Time Analytics",
                desc: "Track attendance trends and class performance instantly.",
              },
              {
                icon: "🔔",
                title: "Smart Notifications",
                desc: "Get alerted for absences or attendance targets automatically.",
              },
              {
                icon: "📱",
                title: "Mobile Optimized",
                desc: "Use AttendEase seamlessly across phones and tablets.",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4 text-2xl">
                  {feat.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{feat.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} AttendEase. All rights reserved.</p>
      </footer>
    </motion.div>
  );
};

export default UserSelection;
