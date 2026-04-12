import axios from "axios";
import { MOBILE_API_BASE_URL } from "./config";

export const mobileApiClient = axios.create({
  baseURL: MOBILE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
