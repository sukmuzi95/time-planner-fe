import React, { useState } from 'react';
import api from 'service/axiosInstance';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // 이메일 인증코드 요청
  const requestCode = async () => {
    if (!email) return alert('이메일을 입력해주세요.');
    try {
      await api.post('/auth/email/send', { email });
      alert('인증 코드가 전송되었습니다.');
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e) {
      console.log(e);
      alert('인증 요청 실패');
    }
  };

  // 인증코드 확인
  const verifyCode = async () => {
    if (!code) return alert('인증 코드를 입력해주세요.');
    try {
      await api.post('/auth/email/verify', { email, code });
      alert('이메일 인증 성공');
      setEmailVerified(true);
    } catch (e) {
      console.log(e);
      alert('인증 실패');
    }
  };

  // 회원가입 요청
  const handleSignUp = async () => {
    if (!email || !password) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (!emailVerified) {
      alert('이메일 인증을 먼저 완료해주세요.');
      return;
    }

    try {
      await api.post('/auth/signup', { email, password });
      alert('회원가입 성공!');
    } catch (e) {
      console.log(e);
      alert('회원가입 실패');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          📮 TimePlanner 회원가입
        </h2>

        <label className="block mb-1 font-medium text-gray-700">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={emailVerified}
          className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={requestCode}
          disabled={cooldown > 0 || emailVerified}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg mb-4"
        >
          {emailVerified ? '인증 완료됨' : cooldown > 0 ? `재요청 (${cooldown})` : '인증 코드 전송'}
        </button>

        {!emailVerified && (
          <>
            <input
              type="text"
              placeholder="인증코드 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 mb-2 border rounded-lg"
            />
            <button
              onClick={verifyCode}
              className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg mb-4"
            >
              인증 확인
            </button>
          </>
        )}

        <label className="block mb-1 font-medium text-gray-700">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded-lg"
        />

        <button
          onClick={handleSignUp}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
