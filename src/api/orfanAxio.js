import axios from 'axios';

const orfanAxio = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
  },
});

orfanAxio.interceptors.response.use(
  response => response,
  error => {
    console.error('Global error:', error.message);
    return Promise.reject(error);
  }
);

export default orfanAxio;