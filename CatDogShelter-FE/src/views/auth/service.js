import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
})

// 쿠키만 사용 → 인터셉터에서 아무 것도 안 붙임
api.interceptors.request.use((config) => config)

export async function signupAPI(data) {
  const res = await api.post('/user-service/user/regist', data)
  return res.data
}

export async function loginAPI({ email, password }) {
  const body = {
    userAccount: email,      // 백엔드 DTO 필드에 맞춤
    userPassword: password,
  };
  return api.post('/user-service/user/login', body, {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function meAPI() {
  return api.get('/user-service/user/me')
}

export default api