import { useEffect, useState } from 'react';
import api from 'service/axiosInstance';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { Calendar, Schedule } from 'types/schedules';

export default function ScheduleCalendar() {
  const [events, setEvents] = useState<Calendar[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Calendar | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await api.get('/schedules');
        const fetched = res.data.map((schedule: Schedule) => {
          const base = {
            id: schedule.id.toString(),
            title: schedule.title,
            start: schedule.startDateTime,
            end: schedule.endDateTime,
            color:
              schedule.repeatOption && schedule.repeatOption.type !== 'NONE'
                ? '#4F46E5'
                : '#16a34a',
            extendedProps: {
              repeatOption: schedule.repeatOption
            }
          };
          return base;
        });
        setEvents(fetched);
      } catch (err) {
        console.error('일정 불러오기 실패:', err);
      }
    };

    fetchSchedules();
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      color: clickInfo.event.backgroundColor,
      extendedProps: clickInfo.event.extendedProps as Calendar['extendedProps']
    });
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/schedules/${selectedEvent.id}`);
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
      setSelectedEvent(null);
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: selectedEvent?.title,
        startDateTime: selectedEvent?.start,
        endDateTime: selectedEvent?.end
      };
      await api.put(`/schedules/${selectedEvent?.id}`, payload);
      alert('수정되었습니다.');
      setSelectedEvent(null);
    } catch (err) {
      console.error('수정 실패:', err);
      alert('수정에 실패했습니다.');
    }
  };

  const filteredEvents = events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 나의 일정</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <input
          type="text"
          placeholder="일정 검색"
          className="mb-4 px-4 py-2 border rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={filteredEvents}
          eventClick={handleEventClick}
          height="auto"
          locale="ko"
        />
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">일정 수정</h3>
            <label className="block text-sm font-medium">제목</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-3"
              value={selectedEvent.title}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
            />
            <label className="block text-sm font-medium">시작 시간</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2 mb-3"
              value={selectedEvent.start?.slice(0, 16)}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, start: e.target.value })}
            />
            <label className="block text-sm font-medium">종료 시간</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2 mb-3"
              value={selectedEvent.end?.slice(0, 16)}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, end: e.target.value })}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                저장
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                삭제
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
