import axios from "axios";
import router from "./router";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_PUBLIC_KEY,
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