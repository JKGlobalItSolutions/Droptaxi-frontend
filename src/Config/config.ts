// Configuration constants - SAFE TO COMMIT TO GITHUB
// Update these values after deployment

export const CONFIG = {
  // API Configuration
  API_BASE_URL: "https://droptaxi-backend-1.onrender.com",

  // OpenRouteService API Key (for maps and routing)
  ORS_API_KEY: "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImVlYTYxZGEwNWIwNDRiYWQ5YzEyMGUxYmE1NDFlZWUxIiwiaCI6Im11cm11cjY0In0=",

  // EmailJS Configuration (for booking emails)
  EMAILJS: {
    SERVICE_ID: "service_s49kq4k",
    TEMPLATE_ID: "template_mnz0bhg",
    PUBLIC_KEY: "P80nK4XrJRg7RULGo"
  }
};

// Helper function to get production URL if available
export const getApiBaseUrl = (): string => {
  // During deployment, update this URL to your production backend
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return "http://localhost:5000";
  }
  return CONFIG.API_BASE_URL;
};
