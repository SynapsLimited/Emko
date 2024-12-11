// src/utils/api.js

export const fetchAPI = async (endpoint) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error in fetchAPI: ${error}`);
      throw error;
    }
  };
  