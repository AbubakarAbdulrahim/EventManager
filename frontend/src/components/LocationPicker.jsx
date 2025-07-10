// components/LocationPicker.jsx
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import '../services/leaflet-icon-fix';

const LocationMarker = ({ position, setLatLng }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLatLng({ lat, lng });
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapCenterUpdater = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
};

const LocationPicker = ({ selectedLatLng, setLatLng }) => {
  const [markerPosition, setMarkerPosition] = useState(selectedLatLng || null);

  useEffect(() => {
    if (selectedLatLng) setMarkerPosition([selectedLatLng.lat, selectedLatLng.lng]);
  }, [selectedLatLng]);

  return (
    <MapContainer center={[selectedLatLng?.lat || 12.0024, selectedLatLng?.lng || 8.5919]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && <Marker position={markerPosition} />}
      <LocationMarker position={markerPosition} setLatLng={setLatLng} />
      {selectedLatLng && <MapCenterUpdater lat={selectedLatLng.lat} lng={selectedLatLng.lng} />}
    </MapContainer>
  );
};

export default LocationPicker;
