import { useState, useEffect } from 'react';
import axios from 'axios';

function TestApi() {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // Lấy từ localStorage
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:8080/api/v1';

  // Gọi API đăng nhập
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token); // Lưu token
        localStorage.setItem('user', JSON.stringify({
            user_id: response.data.user.user_id,
            email: response.data.user.email,
            roles: response.data.user.roles
        })); // Lưu thông tin user an toàn

        console.log('Token:', localStorage.getItem('token'));
        console.log('User:', JSON.parse(localStorage.getItem('user')));
        alert('Đăng nhập thành công!');
      } else {
        console.error('Không nhận được token từ API');
      }
    } catch (err) {
      setError('Sai tài khoản hoặc mật khẩu!');
      console.error('Lỗi đăng nhập:', err);
    }
  };
  
  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token
    setToken('');
    alert('Đã đăng xuất!');
  };

  return (
    <div>
      <h2>Test Đăng Nhập</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" />
      <button onClick={handleLogin}>Đăng nhập</button>

      {token && (
        <>
          <p>Token: {token}</p>
          <button onClick={handleLogout}>Đăng xuất</button>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default TestApi;
