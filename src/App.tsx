import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignUp } from 'pages/SignUp';
import { SignIn } from 'pages/SignIn';
import { Home } from 'pages/Home';
import { RequireAuth } from 'router/RequireAuth';
import { Profile } from 'pages/Profile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}
