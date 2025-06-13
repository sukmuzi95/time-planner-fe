import axios from 'axios';

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
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axios.post('/auth/reissue-token', {}, { withCredentials: true });
        const accessToken = res.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original); // 🔁 재요청
      } catch (err) {
        // 🔐 재발급 실패 → 강제 로그아웃
        console.log(err);
        localStorage.clear();
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
