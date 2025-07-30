import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from 'store/userStore';

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { nickname, clearUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    clearUser();
    navigate('/');
  };

  const initials = nickname ? nickname[0].toUpperCase() : 'U';
  const avatarUrl = nickname
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname || 'User')}&background=indigo&color=fff&rounded=true`
    : null;

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        TimePlanner
      </Link>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/profile">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="프로필"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold cursor-pointer">
                  {initials}
                </div>
              )}
            </Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500">
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/signin" className="text-sm text-indigo-600 hover:underline">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
