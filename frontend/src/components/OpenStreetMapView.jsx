// components/OpenStreetMapView.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const OpenStreetMapView = ({ lat, lng }) => {
  return (
    <MapContainer center={[lat, lng]} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>We're here!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default OpenStreetMapView;
