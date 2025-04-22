import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Menu,
  X,
  Fingerprint,
  CalendarCheck,
  Cloud,
  ShieldCheck,
  Users,
  User,
  Clock,
  BarChart3,
  Bell,
  Calendar,
  Sun,
  Phone,
  Moon,
  AlertTriangle
} from 'lucide-react';

export default function AttendEaseHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [darkMode, setDarkMode] = useState(false);

  // Scroll handler for section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });
      
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dark mode toggle handler
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Navigation items configuration
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md fixed w-full z-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              📘AttendEase
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`${
                      activeSection === item.id
                        ? 'border-indigo-500 text-gray-900 dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                to="/user-selection"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden -mr-2 flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`${
                    activeSection === item.id
                      ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex items-center justify-between px-4 py-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <Link
                  to="/user-selection"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-12 sm:pt-32 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Simplified Attendance Tracking
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Intelligent solution for educational institutions to streamline attendance management
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link
                to="/user-selection"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                Get Started
                <ChevronRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="relative w-full max-w-4xl h-64 sm:h-72 md:h-80 lg:h-96 rounded-lg shadow-xl overflow-hidden">
              <img 
                src="/images/dashboard-preview.jpg" 
                alt="Dashboard preview" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="font-semibold text-lg">Modern Attendance Dashboard</p>
                <p className="text-sm opacity-80">Real-time insights for better decision making</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
              Simple three-step process for efficient management
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Step 1 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 text-white mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Select Role</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose between Teacher, Student, or Administrator access levels
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 text-white mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Manage Attendance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time tracking with automatic data synchronization
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 text-white mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Data</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate detailed reports and insights for decision making
              </p>
            </div>
          </div>
        </div>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
        Academic Workflow Management
      </h2>
      <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
        Institution-grade process designed for educational excellence
      </p>
    </div>

    <div className="mt-10 grid md:grid-cols-3 gap-8">
      {[
        {
          title: "Secure Access",
          icon: <Fingerprint size={24} />,
          features: [
            "Role-based login (Faculty/Student/Admin)",
            "Two-factor authentication support",
            "Department-level access controls",
            "Activity audit trails"
          ]
        },
        {
          title: "Attendance Management",
          icon: <CalendarCheck size={24} />,
          features: [
            "Real-time class tracking with geofencing",
            "Automated late/missing alerts",
            "Substitute teacher assignment",
            "Timetable conflict detection"
          ]
        },
        {
          title: "Data & Analytics",
          icon: <BarChart3 size={24} />,
          features: [
            "Automated UGC-compliant reports",
            "Student engagement analytics",
            "Pattern recognition system",
            "Export to academic ERP systems"
          ]
        }
      ].map((section, index) => (
        <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center mb-4">
            <div className="text-white">{section.icon}</div>
          </div>
          <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
          <ul className="space-y-3 pl-5">
            {section.features.map((feature, fIndex) => (
              <li key={fIndex} className="relative text-gray-600 dark:text-gray-300">
                <span className="absolute -left-5 text-indigo-500">▹</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Detailed Process Flow */}
    <div className="mt-16 grid md:grid-cols-5 gap-6 items-center">
      <div className="md:col-span-2">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Key Academic Integrations
        </h3>
        <ul className="space-y-4 text-gray-600 dark:text-gray-300">
          <li className="flex items-start">
            <ShieldCheck className="flex-shrink-0 h-6 w-6 text-indigo-500 mr-3" />
            <div>
              <span className="font-semibold">FERPA Compliance:</span>
              <span className="block text-sm">End-to-end encrypted data storage with AES-256 standard</span>
            </div>
          </li>
          <li className="flex items-start">
            <Cloud className="flex-shrink-0 h-6 w-6 text-indigo-500 mr-3" />
            <div>
              <span className="font-semibold">Cloud Sync:</span> 
              <span className="block text-sm">Real-time sync across devices with offline support</span>
            </div>
          </li>
        </ul>
      </div>
      <div className="md:col-span-3 relative h-64 sm:h-96 rounded-xl shadow-xl overflow-hidden">
        <img 
          src="/images/academic-workflow.jpg" 
          alt="Academic workflow" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent" />
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Key Features
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
              Comprehensive tools for modern attendance management
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <BarChart3 size={24} />, title: 'Real-time Analytics', 
                desc: 'Instant insights with interactive dashboards' },
              { icon: <Bell size={24} />, title: 'Smart Notifications', 
                desc: 'Automated alerts for attendance anomalies' },
              { icon: <Calendar size={24} />, title: 'Schedule Integration', 
                desc: 'Sync with existing academic calendars' },
              { icon: <Clock size={24} />, title: 'Time Tracking', 
                desc: 'Precision monitoring of class durations' },
              { icon: <User size={24} />, title: 'Role Management', 
                desc: 'Granular access control for all users' },
              { icon: <AlertTriangle size={24} />, title: 'Issue Resolution', 
                desc: 'Built-in discrepancy reporting system' },
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-indigo-500 text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Enhanced Features Section */}
<section id="features" className="py-12 bg-white dark:bg-gray-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
        Academic-First Features
      </h2>
      <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
        Specialized tools for educational institution management
      </p>
    </div>

    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          category: "Security & Compliance",
          icon: <ShieldCheck size={20} />,
          features: [
            "Military-grade encryption (AES-256)",
            "GDPR & FERPA compliant storage",
            "Role-based access control (RBAC)",
            "Complete audit trails"
          ]
        },
        {
          category: "Smart Tracking",
          icon: <Clock size={20} />,
          features: [
            "Geofenced attendance marking",
            "Automated late attendance alerts",
            "Substitute management system",
            "Timetable conflict detection"
          ]
        },
        {
          category: "Academic Analytics",
          icon: <BarChart3 size={20} />,
          features: [
            "Student engagement scores",
            "Attendance pattern analysis",
            "UGC-compliant reports",
            "Predictive analytics engine"
          ]
        },
        {
          category: "Institution Management",
          icon: <Users size={20} />,
          features: [
            "Department-level controls",
            "Bulk student onboarding",
            "Academic year configuration",
            "Multi-campus support"
          ]
        }
      ].map((category, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center mr-3">
              <div className="text-white">{category.icon}</div>
            </div>
            <h3 className="text-xl font-semibold">{category.category}</h3>
          </div>
          <ul className="space-y-3 pl-2">
            {category.features.map((feature, fIndex) => (
              <li key={fIndex} className="flex items-start text-gray-600 dark:text-gray-300">
                <ChevronRight className="flex-shrink-0 h-5 w-5 text-indigo-500 mr-2 mt-1" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* About Section */}
      <section id="about" className="py-12 bg-indigo-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              About AttendEase
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 sm:mt-4">
              Revolutionizing educational administration since 2023
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Developed by education technology experts, AttendEase combines cutting-edge innovation
                with deep understanding of institutional needs to deliver unparalleled efficiency
                in attendance management.
              </p>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">Our Mission</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Empower educational institutions with intelligent tools that transform administrative
                  tasks into strategic advantages.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-md text-center">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Institutions</div>
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-md text-center">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">99.9%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
                </div>
              </div>
            </div>
            <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 rounded-xl shadow-xl overflow-hidden">
              <img 
                src="/images/team-collaboration.jpg" 
                alt="Team collaboration" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="font-semibold text-lg">Dedicated Team</p>
                <p className="text-sm opacity-80">Committed to educational excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
{/* Contact Section */}
<section id="contact" className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
        Contact Us
      </h2>
      <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
        Let's transform your institution's attendance management
      </p>
    </div>

    <div className="mt-12 grid md:grid-cols-2 gap-8">
      {/* Contact Information Column */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <Phone className="text-indigo-500 mr-2" size={20} />
            <span className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center">
            <User className="text-indigo-500 mr-2" size={20} />
            <span className="text-gray-700 dark:text-gray-300">support@attendease.com</span>
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Office Hours</h4>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p>Monday - Friday: 9AM - 5PM EST</p>
              <p>Saturday: 10AM - 2PM EST</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div> {/* Added missing closing div */}

      {/* Contact Form Column */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="john@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="How can we help you?"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-gray-300 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">AttendEase</h3>
              <p className="text-sm">
                Revolutionizing attendance management for educational institutions worldwide
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.998 12c0-6.628-5.372-12-11.999-12-6.628 0-12 5.372-12 12 0 5.988 4.388 10.952 10.124 11.852v-8.384h-3.076v-3.468h3.076v-2.643c0-3.027 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.468h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#partners" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#cookies" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} AttendEase. All rights reserved.
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Designed with ❤️ by Education Technology Experts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}