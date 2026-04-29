
import axios from "axios";

// const DEV_URL = "http://172.20.10.4:3000/api";
const DEV_URL = " https://joanna-nonpredicative-oversourly.ngrok-free.dev/api";
const PROD_URL = "https://api.yourdomain.com/api";

const axiosInstance = axios.create({
 baseURL: __DEV__ ? DEV_URL : PROD_URL,
 withCredentials: true, // ✅ REQUIRED for cookies
});


export default axiosInstance;














