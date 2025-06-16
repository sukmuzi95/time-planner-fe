import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import api from 'service/axiosInstance';

export function Profile() {
  const { email, nickname, setUser } = useUserStore();
  const [newName, setNewName] = useState(nickname);
  const [editMode, setEditMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (pw: string) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(pw);
  };

  const handleSaveProfile = async () => {
    try {
      const res = await api.put('/users/me', { nickname: newName });
      console.log(res);
      setUser({ email, nickname: newName });
      setEditMode(false);
      alert('프로필이 수정되었어요 !');
    } catch (e) {
      console.log(e);
      alert('프로필 수정에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleChangePassword = async () => {
    setError('');
    if (!currentPassword || !newPassword || !confirmPassword)
      return alert('모든 항목을 입력해주세요.');

    if (!validatePassword(newPassword)) {
      setError('비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호와 확인이 일치하지 않습니다.');
      return;
    }

    try {
      await api.put('/users/me/password', {
        currentPassword,
        newPassword
      });
      alert('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      alert('비밀번호 변경 실패 (기존 비밀번호 확인 필요)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">👤 마이페이지</h2>
        <p className="text-gray-700 mb-4">
          이메일: <strong>{email}</strong>
        </p>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">닉네임</label>
          {editMode ? (
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 rounded"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-1">
              <span>{nickname}</span>
              <button
                onClick={() => setEditMode(true)}
                className="text-sm text-indigo-600 hover:underline"
              >
                수정
              </button>
            </div>
          )}
        </div>

        <hr className="my-6" />

        <h3 className="text-lg font-bold mb-2 text-gray-800">🔑 비밀번호 변경</h3>
        <label className="block mb-1 font-medium text-gray-700">현재 비밀번호</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-lg"
        />
        <label className="block mb-1 font-medium text-gray-700">새 비밀번호</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-lg"
        />
        <label className="block mb-1 font-medium text-gray-700">새 비밀번호 확인</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-lg"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          onClick={handleChangePassword}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  );
}
