import axios from "axios";
import { storage } from "../utils/storage";

// Use o IP da sua máquina se estiver testando em um dispositivo real
const API_BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getItem("zenda_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.removeItem("zenda_token");
    }
    return Promise.reject(error);
  }
);
