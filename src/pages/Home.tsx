import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>🏠 TimePlanner</h1>
      <p>
        <Link to="/signup">회원가입</Link> | <Link to="/signin">로그인</Link>
      </p>
    </div>
  );
}
