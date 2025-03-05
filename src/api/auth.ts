import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:3000';

// Types
interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
}

// Auth API functions
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<void> => {
  await axios.post(`${API_URL}/auth/register`, credentials);
};

export const fetchUserData = async () => {
  const response = await axios.get(`${API_URL}/auth/me`);
  return response.data;
};