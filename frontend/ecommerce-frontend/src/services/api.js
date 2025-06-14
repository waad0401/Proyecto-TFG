import axios from 'axios';

/* ---------------- Config estática (.env) ----------------- */
export const config = {
  apiBaseUrl   : process.env.VUE_APP_API_DEFAULT ?? 'http://localhost:3000/api',
  imageBaseUrl : process.env.VUE_APP_IMG_DEFAULT ?? 'http://localhost:3000/api'
};

/* ---- Instancia única de Axios (se actualizará luego) ----- */
export const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10_000
});

/* Actualiza baseURL en caliente, una vez tengamos config.json */
function setBaseURLs () {
  api.defaults.baseURL    = config.apiBaseUrl;
  axios.defaults.baseURL  = config.apiBaseUrl; // por si usas axios suelto
}

/* --------- Interceptores JWT (se mantienen) --------------- */
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

/* ------------ Cargar config.json (runtime) ---------------- */
export async function loadConfig () {
  try {
    const res = await fetch('/config.json', { cache: 'no-cache' });
    const dyn  = await res.json();
    Object.assign(config, dyn);         // mezcla valores dinámicos
  } catch (err) {
    console.warn('config.json no encontrado; usando valores .env', err);
  } finally {
    setBaseURLs();                      // ← actualiza instancia axios
  }
}

export default api;
