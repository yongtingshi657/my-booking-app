import axios from "axios";

// 1. Prioritize the Render URL, fallback to local for dev
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3500";

const customFetch = axios.create({
  baseURL: BASE_URL
});

export default customFetch;
