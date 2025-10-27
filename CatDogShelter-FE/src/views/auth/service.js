// src/views/auth/service.js
const BASE_URL = '/api';

async function request(path, { method='GET', body, headers={}, auth=true } = {}) {
  const token = localStorage.getItem('token')
  const h = { 'Content-Type': 'application/json', ...headers }
  if (auth && token) h.Authorization = `Bearer ${token}`

  const res = await fetch(BASE_URL + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined })
  const text = await res.text()
  let data; try { data = text ? JSON.parse(text) : null } catch { data = null }

  if (!res.ok) throw new Error((data && (data.message || data.error)) || res.statusText || `HTTP ${res.status}`)
  return data
}

export const loginAPI  = (payload) => request('/auth/login',  { method:'POST', body: payload, auth:false })
export const signupAPI = (payload) => request('/auth/signup', { method:'POST', body: payload, auth:false })
export const meAPI     = ()        => request('/auth/me')
export { request }
