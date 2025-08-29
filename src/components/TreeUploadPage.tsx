import React, { useRef, useState, useEffect } from "react";

export default function TreeUploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [timestamp, setTimestamp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationPermission, setLocationPermission] = useState<PermissionState | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check location permission status
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        result.onchange = () => {
          setLocationPermission(result.state);
        };
      });
    }
  }, []);

const handleLogout = () => {
  localStorage.removeItem("tokens");
  sessionStorage.removeItem("tokens");
  window.location.reload(); // forces App.tsx to re-check tokens and show LoginPage
};

  const handleFileTrigger = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setImage(file);
    setTimestamp(new Date().toISOString());
    setError("");
    
    // Immediately request location after file selection
    requestLocation();
  };

  const requestLocation = () => {
    setIsRequestingLocation(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsRequestingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsRequestingLocation(false);
      },
      (err) => {
        console.error("Location error:", err.message);
        setLocation(null);
        
        let errorMessage = "Please allow location access to upload tree images.";
        if (err.code === err.PERMISSION_DENIED) {
          errorMessage = "Location access was denied. Please enable it in your browser settings.";
        } else if (err.code === err.TIMEOUT) {
          errorMessage = "Location request timed out. Please try again.";
        }
        
        setError(errorMessage);
        setIsRequestingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleManualLocationRequest = () => {
    if (locationPermission === 'denied') {
      setError("Location permission was previously denied. Please enable it in your browser settings.");
      return;
    }
    requestLocation();
  };

  const handleSubmit = () => {
    if (!image) {
      setError("Please choose an image.");
      return;
    }
    if (!location) {
      setError("Location is required. Please allow location access.");
      return;
    }

    // Submit logic here
    console.log("Uploading Tree Data:", { image, location, timestamp });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center text-gray-800 relative">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6">Upload a Tree Image</h2>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={handleFileTrigger}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
        >
          Choose File
        </button>

        {image && (
          <div className="mb-3">
            <p className="text-sm mb-1">Image selected: {image.name}</p>
            {image.type.startsWith("image/") && (
              <img 
                src={URL.createObjectURL(image)} 
                alt="Preview" 
                className="max-h-40 mx-auto mt-2 rounded-lg"
              />
            )}
          </div>
        )}

        {isRequestingLocation && (
          <div className="my-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-blue-700">Waiting for location access...</p>
            <p className="text-sm text-blue-600">Please check for a browser permission popup</p>
          </div>
        )}

        {location ? (
          <p className="text-sm font-semibold mb-1">
            Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
        ) : (
          !isRequestingLocation && (
            <button
              onClick={handleManualLocationRequest}
              className="mb-3 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Request Location Again
            </button>
          )
        )}

        {timestamp && (
          <p className="text-sm font-semibold mb-3">
            Timestamp: {new Date(timestamp).toLocaleString()}
          </p>
        )}

        {error && (
          <div className="p-2 mb-3 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
            {error.includes("denied") && (
              <p className="text-xs mt-1 text-red-600">
                Check browser settings or try another browser
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!image || !location || isRequestingLocation}
          className={`${
            !image || !location ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white font-bold py-2 px-4 rounded-xl w-full`}
        >
          Upload Tree Data
        </button>
      </div>
    </div>
  );
}
