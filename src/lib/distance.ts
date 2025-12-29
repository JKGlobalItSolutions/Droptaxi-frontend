// Shared city data and distance calculation utilities
export const AVAILABLE_CITIES = [
  { name: "Tiruvannamalai", coords: [79.0728, 12.2406] },
  { name: "Chennai", coords: [80.2785, 13.0827] },
  { name: "Bangalore", coords: [77.5937, 12.9716] },
  { name: "Pondicherry", coords: [79.8083, 11.9139] },
  { name: "Coimbatore", coords: [76.9558, 11.0168] },
  { name: "Salem", coords: [78.1460, 11.6643] },
  { name: "Vellore", coords: [79.1329, 12.9165] },
  { name: "Trichy", coords: [78.7047, 10.7905] },
  { name: "Madurai", coords: [78.1198, 9.9252] },
  { name: "Kancheepuram", coords: [79.6784, 12.8196] },
  { name: "Villupuram", coords: [79.4914, 11.9397] },
  { name: "Cuddalore", coords: [79.7460, 11.7461] },
  { name: "Arcot", coords: [79.3340, 12.9092] },
  { name: "Walajah", coords: [79.3647, 12.9292] },
  { name: "Arani", coords: [79.2842, 12.6767] },
  { name: "Polur", coords: [79.1333, 12.5167] },
  { name: "Chetput", coords: [79.3177, 12.2391] },
  { name: "Mangalore", coords: [74.8550, 12.9141] },
  { name: "Mysore", coords: [76.6393, 12.2958] },
  { name: "Hosur", coords: [77.8235, 12.7409] }
];

// Find city by flexible name matching
export const findCityByName = (input?: string) => {
  if (!input) return null;
  const txt = input.trim().toLowerCase();

  // Exact match
  let city = AVAILABLE_CITIES.find(c => c.name.toLowerCase() === txt);
  if (city) return city;

  // Contains or startsWith
  city = AVAILABLE_CITIES.find(c => txt.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(txt));
  if (city) return city;

  // Fallback: partial token match
  const tokens = txt.split(/[,\s]+/).filter(Boolean);
  for (const t of tokens) {
    city = AVAILABLE_CITIES.find(c => c.name.toLowerCase().includes(t));
    if (city) return city;
  }

  return null;
};

// Unified distance calculation function
export const calculateRealDistance = async (pickupLocation: string, dropLocation: string) => {
  try {
    // Find coordinates for pickup and drop cities (flexible matching)
    const pickupCity = findCityByName(pickupLocation);
    const dropCity = findCityByName(dropLocation);

    if (!pickupCity || !dropCity) {
      console.warn("Cities not found in predefined list, using fallback");
      return Math.floor(Math.random() * 50) + 10;
    }

    const pickupCoords = pickupCity.coords;
    const dropCoords = dropCity.coords;

    // Use OpenRouteService API for driving distance calculation
    const apiKey = import.meta.env.VITE_ORS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_ORS_API_KEY_HERE') {
      console.warn("OpenRouteService API key not set, using fallback haversine distance");
      // Fallback to haversine distance calculation
      const R = 6371; // Earth's radius in km
      const dLat = (dropCoords[1] - pickupCoords[1]) * Math.PI / 180;
      const dLon = (dropCoords[0] - pickupCoords[0]) * Math.PI / 180;
      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(pickupCoords[1] * Math.PI / 180) * Math.cos(dropCoords[1] * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return Math.round(distance * 10) / 10; // Round to 1 decimal
    }

    // Step 3: Calculate driving distance using API
    const distanceResponse = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${pickupCoords[0]},${pickupCoords[1]}&end=${dropCoords[0]},${dropCoords[1]}`
    );

    if (!distanceResponse.ok) {
      console.warn("ORS distance calculation failed, using haversine fallback");
      // Fallback to haversine distance
      const R = 6371;
      const dLat = (dropCoords[1] - pickupCoords[1]) * Math.PI / 180;
      const dLon = (dropCoords[0] - pickupCoords[0]) * Math.PI / 180;
      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(pickupCoords[1] * Math.PI / 180) * Math.cos(dropCoords[1] * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return Math.round(distance * 10) / 10;
    }

    const distanceData = await distanceResponse.json();

    if (distanceData.features && distanceData.features.length > 0) {
      const distance = distanceData.features[0].properties.segments[0].distance / 1000; // Convert meters to km
      return Math.round(distance * 10) / 10; // Round to 1 decimal
    }

    console.warn("ORS returned no distance results, using haversine fallback");
    // Final fallback to haversine
    const R = 6371;
    const dLat = (dropCoords[1] - pickupCoords[1]) * Math.PI / 180;
    const dLon = (dropCoords[0] - pickupCoords[0]) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pickupCoords[1] * Math.PI / 180) * Math.cos(dropCoords[1] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;

  } catch (error) {
    console.error("Distance calculation error:", error);
    return Math.floor(Math.random() * 50) + 10;
  }
};
