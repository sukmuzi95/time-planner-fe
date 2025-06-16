import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from 'service/axiosInstance';

export default function ScheduleForm() {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [repeatType, setRepeatType] = useState('NONE');
  const [interval, setInterval] = useState(1);
  const [untilDate, setUntilDate] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const repeatOption =
      repeatType !== 'NONE'
        ? {
            type: repeatType,
            interval,
            untilDate
          }
        : null;

    try {
      await api.post('/schedules', { title, start, end, repeatOption });
      alert('일정이 등록되었습니다!');
      navigate('/schedule/list');
    } catch (err) {
      console.error(err);
      alert('일정 등록 실패');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📌 일정 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">시작 시간</label>
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">종료 시간</label>
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">반복</label>
          <select
            value={repeatType}
            onChange={(e) => setRepeatType(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          >
            <option value="NONE">반복 없음</option>
            <option value="DAILY">매일</option>
            <option value="WEEKLY">매주</option>
            <option value="MONTHLY">매월</option>
          </select>
        </div>

        {repeatType !== 'NONE' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">반복 간격</label>
              <input
                type="number"
                min={1}
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">반복 종료일</label>
              <input
                type="datetime-local"
                value={untilDate}
                onChange={(e) => setUntilDate(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
