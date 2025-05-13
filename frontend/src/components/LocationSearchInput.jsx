// components/LocationSearchInput.jsx
import { useState } from 'react';
import { TextField, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

const LocationSearchInput = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (q) => {
    setQuery(q);
    if (q.length < 3) return;

    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q,
        format: 'json',
        addressdetails: 1,
        limit: 5,
      },
    });

    setResults(res.data);
  };

  return (
    <div style={{ position: 'relative' }}>
      <TextField
        fullWidth
        label="Search Location"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        margin="normal"
      />
      {results.length > 0 && (
        <Paper style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
          <List>
            {results.map((place) => (
              <ListItemButton
                key={place.place_id}
                onClick={() => {
                  onSelect({
                    lat: parseFloat(place.lat),
                    lng: parseFloat(place.lon),
                    display_name: place.display_name,
                  });
                  setResults([]);
                  setQuery(place.display_name);
                }}
              >
                <ListItemText primary={place.display_name} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default LocationSearchInput;
