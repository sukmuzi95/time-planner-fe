import { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer, Event as CalendarEvent, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from 'service/axiosInstance';
import ScheduleForm from 'pages/schedule/ScheduleForm';

const localizer = momentLocalizer(moment);

interface ScheduleData {
  id: number;
  title: string;
  start: string;
  end: string;
  color: string;
  ownerId: number;
  ownerName: string;
}

export default function ScheduleCalendarPage() {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [selected, setSelected] = useState<ScheduleData | null>(null);
  const [showForm, setShowForm] = useState(false);
  // const [view, setView] = useState<'month' | 'week'>('month');
  const views: View[] = ['month', 'week', 'day', 'agenda'];

  const fetchSchedules = useCallback(async () => {
    const res = await api.get('/schedules/shared');
    setSchedules(res.data);
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelected({
      id: 0,
      title: '',
      start: moment(start).format('YYYY-MM-DDTHH:mm'),
      end: moment(start).add(1, 'hours').format('YYYY-MM-DDTHH:mm'),
      color: '#6366F1',
      ownerId: 0,
      ownerName: ''
    });
    setShowForm(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    const found = schedules.find((s) => s.id === event.resource.id);
    if (found) {
      setSelected(found);
      setShowForm(true);
    }
  };

  const handleSubmit = async () => {
    setShowForm(false);
    await fetchSchedules();
  };

  const handleDelete = async () => {
    if (selected?.id) {
      await api.delete(`/schedules/shared/${selected.id}`);
      setShowForm(false);
      await fetchSchedules();
    }
  };

  const getColorForUser = (userId: number): string => {
    const colors = [
      '#6366F1', // indigo
      '#10B981', // emerald
      '#F59E0B', // amber
      '#EF4444', // red
      '#3B82F6', // blue
      '#8B5CF6', // violet
      '#EC4899' // pink
    ];
    return colors[userId % colors.length];
  };

  const events: CalendarEvent[] = schedules.map((schedule) => ({
    title: `${schedule.title} (${schedule.ownerName})`,
    start: moment.parseZone(schedule.start).toDate(),
    end: moment.parseZone(schedule.end).toDate(),
    resource: { id: schedule.id, color: getColorForUser(schedule.ownerId) },
    allDay: false
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📅 공유 캘린더</h1>
      {/* <div className="space-x-2">
        <button
          className={`px-3 py-1 rounded ${view === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('month')}
        >
          월간 뷰
        </button>
        <button
          className={`px-3 py-1 rounded ${view === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setView('week')}
        >
          주간 뷰
        </button>
      </div> */}
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        defaultDate={new Date()}
        style={{ height: 700 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        views={views}
        // showMultiDayTimes
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.resource.color,
            color: 'white',
            borderRadius: '6px',
            padding: '4px'
          }
        })}
      />

      {showForm && selected && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <ScheduleForm
              defaultValues={selected}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              onDelete={selected.id !== 0 ? handleDelete : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}
