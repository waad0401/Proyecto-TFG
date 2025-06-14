// src/services/api.js
import axios from 'axios';

// configuracion vacia que mas adelante se llenara
export const config = {
  apiBaseUrl:   '',
  imageBaseUrl: ''
};

export const api = axios.create({
  baseURL: '',          // Se sobre escribe con el
  timeout: 10_000
});

// JWT
api.interceptors.request.use(req => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// se carga de manera dinamica con el conteido de config.json
export async function loadConfig () {
  try {
    const res = await fetch('/config.json', { cache: 'no-cache' });
    Object.assign(config, await res.json());
  } catch (err) {
    console.error('No se encontró config.json', err);
    throw new Error('Config no cargada');   // evita montar la app sin URL
  }

  // Apunta Axios a la URL recibida
  api.defaults.baseURL = config.apiBaseUrl;
}

export default api;
