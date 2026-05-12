import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import  getDeviceInfo  from "../utils/deviceInfo";

const DEV_URL = "https://joanna-nonpredicative-oversourly.ngrok-free.dev/api";
const PROD_URL = "https://api.yourdomain.com/api";

const axiosInstance = axios.create({
  baseURL: __DEV__ ? DEV_URL : PROD_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const device = getDeviceInfo();

    config.headers = {
      ...(config.headers ?? {}),
      "x-platform": device.platform,
      "x-app-version": device.version,
      "x-device-id": device.deviceId,
    } as any; 

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;