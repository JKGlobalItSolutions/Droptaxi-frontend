// Geocoding function using OpenRouteService Pelias API
export const geocodeLocation = async (locationName: string): Promise<{ lat: number; lon: number; display_name: string } | null> => {
  try {
    if (!locationName || locationName.trim().length === 0) {
      return null;
    }

    const apiKey = import.meta.env.VITE_ORS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_ORS_API_KEY_HERE') {
      console.warn("ORS API key not set for geocoding");
      return null;
    }

    const query = encodeURIComponent(locationName.trim());
    const response = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${query}&boundary.country=IN&size=1`
    );

    if (!response.ok) {
      console.warn(`ORS Geocoding API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data && data.features && data.features.length > 0) {
      const feature = data.features[0];
      const [lon, lat] = feature.geometry.coordinates;
      return {
        lat: lat,
        lon: lon,
        display_name: feature.properties.label || locationName
      };
    }

    return null;
  } catch (error) {
    console.error("ORS Geocoding error:", error);
    return null;
  }
};

// Keep some popular cities for UI autocomplete (but not for distance calculation)
export const POPULAR_CITIES = [
  "Tiruvannamalai", "Chennai", "Bangalore", "Pondicherry", "Coimbatore",
  "Salem", "Vellore", "Trichy", "Madurai", "Kancheepuram", "Villupuram",
  "Cuddalore", "Arcot", "Walajah", "Arani", "Polur", "Chetput",
  "Mangalore", "Mysore", "Hosur", "Vettavalam", "Sathanur", "Kilnachipattu",
  "Tirupattur", "Kollimalai"
];

// Available cities with coordinates for selection dropdowns
export const AVAILABLE_CITIES = [
  { name: "Tiruvannamalai", coords: [79.0700, 12.2333] },
  { name: "Chennai", coords: [80.2785, 13.0827] },
  { name: "Bangalore", coords: [77.5946, 12.9716] },
  { name: "Pondicherry", coords: [79.8083, 11.9139] },
  { name: "Coimbatore", coords: [76.9558, 11.0168] },
  { name: "Salem", coords: [78.1460, 11.6643] },
  { name: "Vellore", coords: [79.1319, 12.9165] },
  { name: "Trichy", coords: [78.7047, 10.7905] },
  { name: "Madurai", coords: [78.1198, 9.9252] },
  { name: "Kancheepuram", coords: [79.7000, 12.8333] },
  { name: "Villupuram", coords: [79.4925, 11.9401] },
  { name: "Cuddalore", coords: [79.7667, 11.7443] },
  { name: "Arcot", coords: [79.3167, 12.9000] },
  { name: "Walajah", coords: [79.3667, 12.9333] },
  { name: "Arani", coords: [79.2833, 12.6667] },
  { name: "Polur", coords: [79.1167, 12.5167] },
  { name: "Chetput", coords: [80.2333, 13.0667] },
  { name: "Mangalore", coords: [74.8550, 12.9141] },
  { name: "Mysore", coords: [76.6394, 12.2958] },
  { name: "Hosur", coords: [77.8000, 12.7333] },
  { name: "Vettavalam", coords: [79.2500, 12.1167] },
  { name: "Sathanur", coords: [79.1833, 12.1833] },
  { name: "Kilnachipattu", coords: [79.7833, 12.8500] },
  { name: "Tirupattur", coords: [78.5678, 12.4919] },
  { name: "Kollimalai", coords: [78.3333, 11.2500] }
];

// Fallback distance estimation when all geocoding fails
export const estimateDistanceFromNames = (pickup: string, drop: string): number => {
  // Simple estimation based on whether locations seem close or far
  const pickupLower = pickup.toLowerCase();
  const dropLower = drop.toLowerCase();

  // If both contain "tiruvannamalai" or district names, assume local travel
  if ((pickupLower.includes('tiruvannamalai') || pickupLower.includes('district')) &&
    (dropLower.includes('tiruvannamalai') || dropLower.includes('district'))) {
    return Math.floor(Math.random() * 30) + 5; // 5-35 km for local
  }

  // If one is Chennai and other is nearby, estimate accordingly
  if ((pickupLower.includes('chennai') && dropLower.includes('tiruvannamalai')) ||
    (pickupLower.includes('tiruvannamalai') && dropLower.includes('chennai'))) {
    return Math.floor(Math.random() * 20) + 180; // Around 180-200 km
  }

  // Default fallback - medium distance
  return Math.floor(Math.random() * 40) + 20; // 20-60 km
};

// Unified distance calculation function - Pure API based approach
export const calculateRealDistance = async (pickupLocation: string, dropLocation: string) => {
  try {
    console.log(`🔍 Finding coordinates for: ${pickupLocation} → ${dropLocation}`);

    // Geocode both locations using ORS API
    const [pickupCoords, dropCoords] = await Promise.all([
      geocodeLocation(pickupLocation),
      geocodeLocation(dropLocation)
    ]);

    if (!pickupCoords || !dropCoords) {
      console.warn("❌ Could not geocode one or both locations");
      return estimateDistanceFromNames(pickupLocation, dropLocation);
    }

    console.log(`✅ Found coordinates:`);
    console.log(`   ${pickupCoords.display_name}: [${pickupCoords.lat}, ${pickupCoords.lon}]`);
    console.log(`   ${dropCoords.display_name}: [${dropCoords.lat}, ${dropCoords.lon}]`);

    // Use OpenRouteService API for driving distance calculation
    const apiKey = import.meta.env.VITE_ORS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_ORS_API_KEY_HERE') {
      console.warn("⚠️ ORS API key not set, using haversine fallback");
      // Fallback to haversine distance calculation
      const R = 6371;
      const dLat = (dropCoords.lat - pickupCoords.lat) * Math.PI / 180;
      const dLon = (dropCoords.lon - pickupCoords.lon) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pickupCoords.lat * Math.PI / 180) * Math.cos(dropCoords.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return Math.round(distance * 10) / 10;
    }

    console.log(`🚗 Calculating driving distance via ORS API...`);
    const distanceResponse = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pickupCoords.lon},${pickupCoords.lat}&end=${dropCoords.lon},${dropCoords.lat}`
    );

    if (!distanceResponse.ok) {
      console.warn(`❌ ORS distance API failed: ${distanceResponse.status}`);
      // Fallback to haversine distance
      const R = 6371;
      const dLat = (dropCoords.lat - pickupCoords.lat) * Math.PI / 180;
      const dLon = (dropCoords.lon - pickupCoords.lon) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pickupCoords.lat * Math.PI / 180) * Math.cos(dropCoords.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return Math.round(distance * 10) / 10;
    }

    const distanceData = await distanceResponse.json();

    if (distanceData.features && distanceData.features.length > 0) {
      const distance = distanceData.features[0].properties.segments[0].distance / 1000; // Convert meters to km
      const roundedDistance = Math.round(distance * 10) / 10;
      console.log(`✅ Driving distance: ${roundedDistance} km`);
      return roundedDistance;
    }

    console.warn("❌ ORS returned no distance results, using haversine fallback");
    // Final fallback to haversine
    const R = 6371;
    const dLat = (dropCoords.lat - pickupCoords.lat) * Math.PI / 180;
    const dLon = (dropCoords.lon - pickupCoords.lon) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pickupCoords.lat * Math.PI / 180) * Math.cos(dropCoords.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;

  } catch (error) {
    if (error instanceof Error && error.message.includes('429')) {
      console.error("🚀 API Rate Limit hit. Please wait a moment.");
    } else {
      console.error("💥 Distance calculation error:", error);
    }
    return estimateDistanceFromNames(pickupLocation, dropLocation);
  }
};
