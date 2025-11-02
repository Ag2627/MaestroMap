// This function's only job is to generate the prompt string for the AI.

// Helper function to format an array of places into a readable string.
const formatPlacesForPrompt = (places) => 
    places.map(p => `${p.name} (Rating: ${p.rating}, Reviews: ${p.reviews})`).join('; ');

// The main prompt generator.
export const generateComparisonPrompt = (dest1Name, places1, dest2Name, places2, travelType) => {
    return `
        You are a travel advisor. Your response MUST be a single, valid JSON object.
        Do not include any text, markdown characters like \`\`\`json, or any explanations outside of the JSON structure itself.

        **Travel Context:**
        - Traveler Profile: ${travelType}
        - Destination 1: ${dest1Name} (Key Attractions: ${formatPlacesForPrompt(places1)})
        - Destination 2: ${dest2Name} (Key Attractions: ${formatPlacesForPrompt(places2)})

        **Task:**
        Analyze the provided attractions, considering their ratings and review counts, and generate a structured travel plan. The descriptions you write must be tailored for the '${travelType}' profile.
        **GIVE for 5 destination only** 
        **JSON Output Structure:**
        {
          "introduction": "A brief, one-sentence summary of the travel comparison.",
          "destination1_analysis": {
            "name": "${dest1Name}",
            "attractions": [
              { "name": "Attraction Name", "rating": 4.5, "reviews": 12000, "description": "A tailored description for this attraction for a ${travelType}." }
            ]
          },
          "destination2_analysis": {
            "name": "${dest2Name}",
            "attractions": [
              { "name": "Attraction Name", "rating": 4.7, "reviews": 15000, "description": "Another tailored description." }
            ]
          },
          "comparison": {
            "title": "Comparison for a ${travelType}",
            "text": "A comparative analysis of the two destinations, highlighting which offers a better experience for the traveler."
          },
          "recommendation": {
            "recommended_destination": "${dest1Name} or ${dest2Name}",
            "reasoning": "A compelling paragraph explaining the final recommendation, referencing specific attractions.YOU should recommend one"
          }
        }
    `;
};