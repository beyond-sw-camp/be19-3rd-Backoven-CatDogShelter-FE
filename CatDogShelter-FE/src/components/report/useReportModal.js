import { reactive } from 'vue';
import { createReport } from './service';

const state = reactive({
  isOpen: false,
  step: 'form', // 'form' | 'confirm' | 'done'
  targetType: null, // 'post' | 'comment' 등
  targetId: null,
  reason: '',
  detail: '',
  loading: false,
  error: '',
});

export function openReport({ targetType, targetId }) {
  state.isOpen = true;
  state.step = 'form';
  state.targetType = targetType;
  state.targetId = targetId;
  state.reason = '';
  state.detail = '';
  state.loading = false;
  state.error = '';
}

export function closeReport() {
  state.isOpen = false;
}

export function useReportModal() {
  return state;
}

 export async function submitReport() {
   try {
     state.loading = true;
     state.error = '';
    // 백엔드 미구현 상태 고려: 실패해도 모달만 닫고 복귀
    try {
      await createReport({
       targetType: state.targetType,
        targetId: state.targetId,
        reason: state.reason,
        detail: state.detail || '',
      });
    } catch (e) {
      console.warn('[report] API 미구현/오류로 로컬 종료 처리:', e?.message);
    }
    // 완료 화면 없이 즉시 닫고 초기화 → 사용자는 원래 페이지로 복귀
    closeReport();
    state.step = 'form';
   } catch (e) {
     state.error = e.message || '전송 중 오류가 발생했습니다.';
   } finally {
     state.loading = false;
   }
 }