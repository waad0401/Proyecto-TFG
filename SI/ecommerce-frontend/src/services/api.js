import axios from 'axios';

export const config = {
  apiBaseUrl: process.env.VUE_APP_API_DEFAULT,
  imageBaseUrl: ''
};

/** Carga los valores dinámicos antes de montar la app */
export async function loadConfig () {
  try {
    const res = await fetch('/config.json');
    Object.assign(config, await res.json());
  } catch (_) {
    /* si no existe config.json tiramos con .env */
  } finally {
    api.defaults.baseURL = config.apiBaseUrl;
  }
}

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10_000
});

/* ---> Interceptores JWT <--- */
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

export default api;
