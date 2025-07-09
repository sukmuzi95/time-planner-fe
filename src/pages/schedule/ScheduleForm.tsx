import { useState } from 'react';
import api from 'service/axiosInstance';
import { Calendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface FormData {
  id?: number;
  title: string;
  start: string;
  end: string;
  color: string;
}

interface Props {
  defaultValues: FormData;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function ScheduleForm({ defaultValues, onSubmit, onCancel, onDelete }: Props) {
  const [form, setForm] = useState<FormData>(defaultValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/schedules/shared/${form.id}`, form);
      } else {
        await api.post('/schedules/shared', form);
      }
      onSubmit();
    } catch (error) {
      console.error('저장 실패', error);
      alert('일정 저장 실패');
    }
  };

  const events: CalendarEvent[] = [
    {
      title: form.title,
      start: new Date(form.start),
      end: new Date(form.end),
      allDay: false,
      resource: { color: form.color }
    }
  ];

  return (
    <div className="p-4 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700 font-medium">제목</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">시작 시간</label>
          <input
            type="datetime-local"
            name="start"
            value={form.start}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">종료 시간</label>
          <input
            type="datetime-local"
            name="end"
            value={form.end}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">색상</label>
          <select
            name="color"
            value={form.color}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="#6366F1">인디고</option>
            <option value="#EF4444">레드</option>
            <option value="#10B981">그린</option>
            <option value="#F59E0B">옐로우</option>
            <option value="#3B82F6">블루</option>
          </select>
        </div>

        <div className="flex justify-between items-center gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            취소
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              삭제
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            저장
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">미리보기</h3>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 300 }}
        />
      </div>
    </div>
  );
}
