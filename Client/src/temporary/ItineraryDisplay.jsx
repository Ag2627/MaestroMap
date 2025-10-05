// src/components/ItineraryDisplay.js
import { FaSun, FaMoon, FaCloudSun, FaMapPin, FaUtensils, FaBed } from 'react-icons/fa'; // Import icons

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 border-b-2 border-gray-200 pb-2 mb-4">
    <div className="text-blue-600">{icon}</div>
    <h4 className="text-xl font-bold text-gray-800">{title}</h4>
  </div>
);

const ActivityItem = ({ name, description }) => (
  <div className="mb-4 pl-4 border-l-2 border-blue-200">
    <p className="font-semibold text-blue-800">{name}</p>
    <p className="text-sm text-gray-600 italic">{description}</p>
  </div>
);

export default function ItineraryDisplay({ itinerary, destinationName }) {
  if (!itinerary || !itinerary.length) {
    return <p>No itinerary data to display.</p>;
  }

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-2xl">
      {/* HEADER */}
      <div className="text-center mb-8 border-b-4 border-blue-600 pb-4">
        <p className="text-gray-500 font-medium">Your Adventure Awaits In</p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
          {destinationName}
        </h2>
      </div>

      {/* ITINERARY DAYS */}
      {itinerary.map((day, index) => (
        <div key={index} className="mb-10 bg-gray-50 p-6 rounded-lg shadow-inner">
          {/* DAY HEADER */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-2">
            <h3 className="text-3xl font-bold text-blue-700">Day {day.day_number}</h3>
            <div className="flex items-center gap-2 text-lg text-gray-700 font-semibold p-2 bg-blue-100 rounded-md">
              <FaBed className="text-blue-600" />
              <span>Stay at: {day.stay_at}</span>
            </div>
          </div>
          
          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side: Activities */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <SectionHeader icon={<FaSun size={24} />} title="Morning Plan" />
                {day.morning_visits.map((visit, vIndex) => <ActivityItem key={vIndex} {...visit} />)}
              </div>
              <div>
                <SectionHeader icon={<FaCloudSun size={24} />} title="Afternoon Plan" />
                {day.afternoon_visits.map((visit, vIndex) => <ActivityItem key={vIndex} {...visit} />)}
              </div>
            </div>

            {/* Right side: Meals and Evening */}
            <div className="space-y-8">
              <div>
                <SectionHeader icon={<FaUtensils size={24} />} title="Meal Suggestions" />
                <ul className="space-y-3 text-gray-700 pl-4">
                  <li><span className="font-semibold">Breakfast:</span> {day.meals.breakfast.name}</li>
                  <li><span className="font-semibold">Lunch:</span> {day.meals.lunch.name}</li>
                  <li><span className="font-semibold">Dinner:</span> {day.meals.dinner.name}</li>
                </ul>
              </div>
              <div>
                <SectionHeader icon={<FaMoon size={24} />} title="Evening Activity" />
                <p className="text-gray-700 pl-4">{day.evening_activity}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}