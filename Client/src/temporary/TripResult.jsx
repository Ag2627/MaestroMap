import React from 'react';
import { FaStar, FaTrophy, FaRegCommentDots } from "react-icons/fa";

// This is the main component that displays the entire trip plan
export default function TripResult({ plan }) {
  if (!plan) return null;

  // We put both destinations into an array to easily map over them
  const destinations = [plan.destination1_analysis, plan.destination2_analysis];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Introduction remains the same */}
      <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <p className="text-lg text-gray-700">{plan.introduction}</p>
      </div>

      {/* --- SIDE-BY-SIDE COMPARISON GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {destinations.map((data, index) => (
          <DestinationColumn 
            key={index} 
            data={data}
            isRecommended={data.name === plan.recommendation.recommended_destination}
          />
        ))}
      </div>

      {/* --- SUMMARY & RECOMMENDATION SECTIONS --- */}
      
      {/* AI's Detailed Comparison Text */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaRegCommentDots className="mr-3 text-orange-500" />
            AI's Detailed Analysis
        </h2>
        <p className="text-gray-600 leading-relaxed">{plan.comparison.text}</p>
      </div>
      
      {/* Final Recommendation */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-6 rounded-xl border-2 border-orange-400 shadow-lg">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent mb-4 flex items-center">
          <FaTrophy className="mr-3" />
          Final Recommendation
        </h2>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.recommendation.recommended_destination}</h3>
        <p className="text-gray-700 leading-relaxed">{plan.recommendation.reasoning}</p>
      </div>
    </div>
  );
}

// Sub-component to display the entire column for one destination
function DestinationColumn({ data, isRecommended }) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md border space-y-4 transition-all duration-300 ${isRecommended ? 'border-orange-400 border-2' : 'border-gray-200'}`}>
      
      {/* City Name and Recommendation Badge */}
      <div className="flex justify-between items-start">
        <h2 className="text-3xl font-bold text-gray-800">{data.name}</h2>
        {isRecommended && (
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
            Recommended
          </span>
        )}
      </div>

      {/* Attractions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Top Attractions</h3>
        {data.attractions.map(attraction => (
          <AttractionCard key={attraction.name} attraction={attraction} />
        ))}
      </div>
    </div>
  );
}

// Sub-component for a single attraction card
function AttractionCard({ attraction }) {
  return (
    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50/30">
      <h4 className="font-semibold text-lg text-orange-800">{attraction.name}</h4>
      <div className="flex items-center text-sm text-gray-500 my-1">
        <FaStar className="text-yellow-400" />
        <span className="ml-1 font-bold">{attraction.rating}</span>
        <span className="mx-2">|</span>
        <span>{attraction.reviews.toLocaleString()} reviews</span>
      </div>
      <p className="text-gray-600 text-sm">{attraction.description}</p>
    </div>
  );
}