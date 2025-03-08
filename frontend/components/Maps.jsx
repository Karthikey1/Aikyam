import { useEffect, useState, useRef } from "react";
import "./Maps.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";

const Maps = () => {
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [uploadedImage, setUploadedImage] = useState("");
  const fileInputRef = useRef(null);

  // Fetch existing markers from local storage
  useEffect(() => {
    const storedMarkers = JSON.parse(localStorage.getItem("markers")) || [];
    setMarkers(storedMarkers);
  }, []);

  // Save markers to local storage
  useEffect(() => {
    localStorage.setItem("markers", JSON.stringify(markers));
  }, [markers]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setError("Unable to fetch location");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadedImage("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      setUploadedImage("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
      setError("");
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
      setUploadedImage("");
    };
    reader.readAsDataURL(file);
  };

  // Add a new marker
  const handleAddMarker = () => {
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    const imageUrl = document.getElementById("image").value;
    const imageToUse = uploadedImage || imageUrl;

    if (isNaN(lat) || isNaN(lng) || !imageToUse) {
      setError("Please fill in all fields correctly.");
      return;
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError("Invalid latitude or longitude values.");
      return;
    }

    const newMarker = {
      id: Date.now(),
      geocode: [lat, lng],
      imageUrl: imageToUse,
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setError("");
    setUploadedImage("");

    // Clear input fields
    document.getElementById("lat").value = "";
    document.getElementById("lng").value = "";
    document.getElementById("image").value = "";
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Use current location
  const handleUseCurrentLocation = () => {
    if (userLocation.lat && userLocation.lng) {
      document.getElementById("lat").value = userLocation.lat;
      document.getElementById("lng").value = userLocation.lng;
    } else {
      setError("Unable to fetch your location.");
    }
  };

  return (
    <div className="map-container">
      <div className="user-input">
        <label htmlFor="lat">Latitude:</label>
        <input
          type="number"
          id="lat"
          placeholder="Enter latitude (-90 to 90)"
        />
        <label htmlFor="lng">Longitude:</label>
        <input
          type="number"
          id="lng"
          placeholder="Enter longitude (-180 to 180)"
        />
        <label htmlFor="image">Image URL:</label>
        <input type="text" id="image" placeholder="Enter image URL" />
        <label htmlFor="imageUpload">Or upload image:</label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
        />
        <button onClick={handleAddMarker}>Add Marker</button>
        <button onClick={handleUseCurrentLocation}>Use My Location</button>
        {error && <p className="error">{error}</p>}
      </div>
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.length > 0 && (
          <MarkerClusterGroup>
            {markers.map((marker) => (
              <Marker key={marker.id} position={marker.geocode}>
                <Popup>
                  <img
                    src={marker.imageUrl}
                    alt="User provided"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </div>
  );
};

export default Maps;