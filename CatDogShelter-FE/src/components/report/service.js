// report 전용 네트워크 모듈 (공용 api 폴더 없이 독립 사용)
const BASE_URL = import.meta.env.VITE_API_BASE || '/api';

export async function createReport(payload, { headers = {} } = {}) {
  const res = await fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    // 쿠키 기반 세션이면 아래 주석 해제
    // credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = '신고 전송에 실패했습니다.';
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json().catch(() => ({}));
}