const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = (rawApiBaseUrl || 'http://localhost:5000').replace(/\/+$/, '');

export const buildApiUrl = (path) => {
  if (!path) return API_BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
