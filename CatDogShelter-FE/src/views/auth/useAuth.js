// src/views/auth/useAuth.js
import { reactive, computed, toRefs } from 'vue'
import { loginAPI, signupAPI, meAPI } from './service'

const state = reactive({
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: ''
})

const isAuthed = computed(() => !!state.token)
function persist() {
  state.token ? localStorage.setItem('token', state.token) : localStorage.removeItem('token')
  state.user  ? localStorage.setItem('user', JSON.stringify(state.user)) : localStorage.removeItem('user')
}

export async function login(form) { // form에 role, keep 포함 가능
  state.loading = true; state.error = ''
  try {
    const { token, user } = await loginAPI(form)
    state.token = token; state.user = user; persist()
    return true
  } catch (e) {
    state.error = e.message || '로그인 실패'
    return false
  } finally { state.loading = false }
}

export async function signup(form) {
  state.loading = true; state.error = ''
  try { await signupAPI(form); return true }
  catch (e) { state.error = e.message || '회원가입 실패'; return false }
  finally { state.loading = false }
}

export function logout() { state.token = ''; state.user = null; persist() }
export async function fetchMe() {
  if (!state.token) return null
  try { state.user = await meAPI(); persist(); return state.user }
  catch { logout(); return null }
}

export function useAuth() {
  return { ...toRefs(state), isAuthed, login, signup, logout, fetchMe }
}
