// src/lib/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function fetchHospitals() {
  const response = await fetch(`${API_BASE_URL}/hospitals/`);
  if (!response.ok) throw new Error("Failed to fetch hospitals");
  return response.json();
}

// You can add more API functions (register, login, etc.) as needed
