import axios from "axios";
import router from "./router.jsx";

const axiosClient = axios.create({
  baseURL: "http://localhost:8002/api",
});

axiosClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
});

axiosClient.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token')
    router.navigate('/login')
    return error;
  }
  throw error;
})

export default axiosClient;