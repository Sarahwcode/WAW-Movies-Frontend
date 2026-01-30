import axios from 'axios';

// This checks if the app is running on your computer or live on the web
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : 'https://waw-movies-backend.onrender.com';

export default axios.create({
  baseURL: API_URL,
});