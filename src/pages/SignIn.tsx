import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from 'service/axiosInstance';
import { useUserStore } from 'store/userStore';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const handleLogin = async () => {
    if (!email || !password) return alert('모든 필드를 입력해주세요.');
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, accessToken } = res.data;

      // ✅ 토큰 저장
      // localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      setUser({ email: user.email, nickname: user.nickname });

      navigate('/'); // 로그인 후 이동
    } catch (e) {
      console.log(e);
      alert('이메일 또는 패스워드를 확인해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          🔐 TimePlanner 로그인
        </h2>

        <label className="block mb-1 font-medium text-gray-700">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <label className="block mb-1 font-medium text-gray-700">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded-lg"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
        >
          로그인
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          회원이 아니신가요?{' '}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
