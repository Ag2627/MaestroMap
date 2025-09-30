import React, { useRef, useEffect } from 'react';

const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
    autocomplete.setFields(['geometry', 'formatted_address']); 

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        onPlaceSelect(place); 
      }
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [onPlaceSelect]);

  return <input ref={inputRef} type="text" placeholder="Search for a location" />;
};

export default PlaceAutocomplete;
