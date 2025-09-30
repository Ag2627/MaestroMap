import { useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from '@react-google-maps/api';
import PlaceAutocomplete from './PlaceAutocomplete';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const controlBoxStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'row', // horizontal layout
  gap: '15px',
  alignItems: 'center',
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

const buttonGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
};

const infoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  marginLeft: '10px',
};

const center = { lat: 40.7128, lng: -74.0060 };
const libraries = ['places'];

function MapComponent() {
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  async function calculateRoute() {
    if (!origin || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: origin.geometry.location,
      destination: destination.geometry.location,
      travelMode: window.google.maps.TravelMode[travelMode],
    });

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    setOrigin(null);
    setDestination(null);
  }

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div style={{ position: 'relative' }}>
      <div style={controlBoxStyle}>
        <div style={inputGroupStyle}>
          <label>Origin:</label>
          <PlaceAutocomplete onPlaceSelect={setOrigin} value={origin?.name || ''} />
        </div>

        <div style={inputGroupStyle}>
          <label>Destination:</label>
          <PlaceAutocomplete onPlaceSelect={setDestination} value={destination?.name || ''} />
        </div>

        <div style={inputGroupStyle}>
          <label>Travel Mode:</label>
          <select onChange={(e) => setTravelMode(e.target.value)} value={travelMode}>
            <option value="DRIVING">Driving</option>
            <option value="WALKING">Walking</option>
            <option value="BICYCLING">Bicycling</option>
            <option value="TRANSIT">Transit</option>
          </select>
        </div>

        <div style={buttonGroupStyle}>
          <button onClick={calculateRoute}>Calculate</button>
          <button onClick={clearRoute}>Clear</button>
        </div>

        {distance && duration && (
          <div style={infoStyle}>
            <p><strong>Distance:</strong> {distance}</p>
            <p><strong>Duration:</strong> {duration}</p>
          </div>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={setMap}
      >
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </div>
  );
}

export default MapComponent;
