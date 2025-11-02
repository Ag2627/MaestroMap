// src/components/ItineraryDisplay.js
import { FaSun, FaMoon, FaCloudSun, FaUtensils, FaBed, FaCar } from 'react-icons/fa';

// Helper Component: SectionHeader (for consistent styling)
// No changes needed here.
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 border-b-2 border-gray-200 pb-2 mb-4">
    <div className="text-blue-600">{icon}</div>
    <h4 className="text-xl font-bold text-gray-800">{title}</h4>
  </div>
);

// Helper Component: ActivityItem (to render each visit/activity)
// No changes needed here.
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
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <h3 className="text-3xl font-bold text-blue-700">Day {day.day_number}</h3>
            <div className="flex flex-col sm:flex-row gap-2 text-gray-700 font-semibold text-right">
              <div className="flex items-center justify-end gap-2 p-2 bg-blue-100 rounded-md">
                <FaBed className="text-blue-600" />
                <span>Stay at: {day.stay_at}</span>
              </div>
              {/* Renders the new transport_tip from your prompts */}
              {day.transport_tip && (
                <div className="flex items-center justify-end gap-2 p-2 bg-green-100 rounded-md">
                  <FaCar className="text-green-600" />
                  <span>{day.transport_tip}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side: Activities */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* MORNING SECTION - Handles all itinerary types */}
              <div>
                <SectionHeader icon={<FaSun size={24} />} title="Morning Plan" />
                {day.morning_experience ? (
                  day.morning_experience.map((visit, vIndex) => <ActivityItem key={vIndex} {...visit} />)
                ) : (
                  day.morning_visits.map((visit, vIndex) => <ActivityItem key={vIndex} {...visit} />)
                )}
              </div>
              
              {/* AFTERNOON SECTION - Handles all itinerary types */}
              <div>
                <SectionHeader icon={<FaCloudSun size={24} />} title="Afternoon Plan" />
                {day.afternoon_indulgence ? (
                   day.afternoon_indulgence.map((visit, vIndex) => <ActivityItem key={vIndex} {...visit} />)
                ) : (
                   day.afternoon_visits.map((visit, vIndex) => <ActivityItem key={vIndex} {...visit} />)
                )}
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

              {/* EVENING SECTION - THE MAIN FIX IS HERE */}
              <div>
                <SectionHeader icon={<FaMoon size={24} />} title="Evening Activity" />
                <div className="pl-4">
                  {day.evening_affair ? (
                    // 1. Renders the luxury 'evening_affair' object
                    <ActivityItem name={day.evening_affair.name} description={day.evening_affair.description} />
                  ) : day.evening_activity && typeof day.evening_activity === 'object' ? (
                    // 2. Renders the standard 'evening_activity' object (for cheap/intermediate)
                    <ActivityItem name={day.evening_activity.name} description={day.evening_activity.description} />
                  ) : (
                    // 3. Fallback for old data that might still be a string
                    <p className="text-gray-700">{day.evening_activity}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}