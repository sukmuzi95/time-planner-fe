import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignUp } from 'pages/SignUp';
import { SignIn } from 'pages/SignIn';
import { Home } from 'pages/Home';
import { RequireAuth } from 'router/RequireAuth';
import { Profile } from 'pages/Profile';
import MainLayout from 'layout/MainLayout';
import ScheduleCalendar from 'pages/schedule/ScheduleCalendar';
import { useErrorStore } from 'store/errorStore';
import ErrorAlert from 'components/ErrorAlert';

export default function App() {
  const { errorMessage, setErrorMessage } = useErrorStore();

  return (
    <>
      <ErrorAlert message={errorMessage} onClose={() => setErrorMessage(null)} />

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
            {/* <Route path="/schedule" element={<ScheduleForm />} /> */}
            <Route path="/schedule" element={<ScheduleCalendar />} />
          </Route>

          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>
    </>
  );
}
