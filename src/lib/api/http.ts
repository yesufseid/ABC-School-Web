import axios, { AxiosError } from "axios";
import { store } from "@/lib/store";
import { logout } from "@/lib/store/slices/auth.slice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1/",
  withCredentials: true,
});

const publicRoutes = ["/auth/login"];

function logoutAndRedirect() {
  store.dispatch(logout());
  window.location.replace(`${window.location.origin}/auth/login`);
}

api.interceptors.request.use((config) => {
  const url = config.url;

  const isPublic = publicRoutes.some((route) => url?.includes(route));

  if (isPublic) return config;

  const token = store.getState().auth.accessToken;

  if (!token) {
    logoutAndRedirect();
    return Promise.reject(new Error(`Authentication Required`));
  }

  config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    console.log(error);

    if (status === 401) {
      logoutAndRedirect();
    }

    if (status === 403) {
      // Todo: consider a forbidden page
      logoutAndRedirect();
    }

    if (status) return Promise.reject(error);
  },
);

export { api };
