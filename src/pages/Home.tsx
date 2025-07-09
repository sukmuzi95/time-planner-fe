import { Header } from 'components/Header';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-white">
      <Header />

      <section
        className="flex flex-col items-center justify-center px-6 py-20 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f")'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl max-w-3xl text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-6">⏰ TimePlanner</h1>
          <p className="text-lg sm:text-xl text-gray-700">
            당신의 하루를 계획하세요. 일정 관리와 시간표 기능을 하나의 앱에서 제공합니다.
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">🔍 주요 기능 소개</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link to="/schedule">
              <div className="bg-indigo-50 rounded-xl p-6 shadow text-center">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">일정 등록</h3>
                <p className="text-gray-600">
                  일정을 손쉽게 등록하고 관리하세요. 반복 설정과 태그 지정도 가능합니다.
                </p>
              </div>
            </Link>
            <Link to="/schedule">
              <div className="bg-indigo-50 rounded-xl p-6 shadow text-center">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">시간표 보기</h3>
                <p className="text-gray-600">
                  주간/월간 시간표로 일정을 한눈에 확인하고 계획을 세울 수 있습니다.
                </p>
              </div>
            </Link>
            <div className="bg-indigo-50 rounded-xl p-6 shadow text-center">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">이메일 인증</h3>
              <p className="text-gray-600">
                안전한 사용을 위해 회원가입 시 이메일 인증을 거칩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-gray-400 text-sm text-center py-8">
        © 2025 TimePlanner. All rights reserved.
      </footer>
    </div>
  );
}
