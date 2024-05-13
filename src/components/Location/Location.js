import React, { useState, useEffect } from 'react';

const ZipCodeLocator = () => {
    const [zipCode, setZipCode] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if geolocation is supported
        if ("geolocation" in navigator) {
            // Request user's location
            navigator.geolocation.getCurrentPosition(
                successCallback,
                errorCallback
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    const successCallback = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Fetch zip code using latitude and longitude
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
                const zipCode = data.address.postcode;
                setZipCode(zipCode);
            })
            .catch(error => {
                setError("Error fetching zip code.");
            });
    };

    const errorCallback = (error) => {
        setError("Error getting location: " + error.message);
    };

    return (
        <div>
            {zipCode ? (
                <p>Your current zip code is: {zipCode}</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <p>Locating...</p>
            )}
        </div>
    );
};

export default ZipCodeLocator;
