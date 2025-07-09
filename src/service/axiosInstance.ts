import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useErrorStore } from 'store/errorStore';

interface ErrorResponse {
  status?: number;
  message?: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3000/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axios.post<{ accessToken: string }>(
          '/auth/reissue-token',
          {},
          { withCredentials: true }
        );
        const accessToken = res.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        original.headers = { ...original.headers, Authorization: `Bearer ${accessToken}` };
        return api(original); // 🔁 재요청
      } catch (refreshError) {
        // 🔐 재발급 실패 → 강제 로그아웃
        const refreshAxiosError = refreshError as AxiosError<{ message?: string }>;
        const msg =
          refreshAxiosError.response?.data?.message ||
          '인증이 만료되었습니다. 다시 로그인해주세요.';
        useErrorStore.getState().setErrorMessage(msg);

        localStorage.clear();
        window.location.href = '/signin';
      }
    }

    const axiosError = error as AxiosError<ErrorResponse>;
    const msg = axiosError.response?.data?.message || '요청 처리 중 오류가 발생했습니다.';
    useErrorStore.getState().setErrorMessage(msg);

    return Promise.reject(error);
  }
);

export default api;
