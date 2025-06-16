import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignUp } from 'pages/SignUp';
import { SignIn } from 'pages/SignIn';
import { Home } from 'pages/Home';
import { RequireAuth } from 'router/RequireAuth';
import { Profile } from 'pages/Profile';
import MainLayout from 'layout/MainLayout';
import ScheduleForm from 'pages/schedule/ScheduleForm';
import ScheduleCalendar from 'pages/schedule/ScheduleCalendar';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route path="/profile" element={<Profile />} />
          <Route path="/schedule" element={<ScheduleForm />} />
          <Route path="/schedule/list" element={<ScheduleCalendar />} />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}
