<script setup>
import { computed } from 'vue';
import { useReportModal, closeReport, submitReport } from './useReportModal';

const s = useReportModal();
const typeLabel = computed(() => (s.targetType === 'comment' ? '댓글' : '게시글'));

const reasonOptions = [
  { value: 'spam',    label: '스팸 / 도배' },
  { value: 'abuse',   label: '욕설 / 비방 / 혐오 발언' },
  { value: 'obscene', label: '음란물 / 선정적 콘텐츠' },
  { value: 'scam',    label: '사기 / 거래 관련 문제' },
  { value: 'misinfo', label: '허위 정보 / 잘못된 정보' },
  { value: 'other',   label: '기타' },
];

const canContinue = computed(() => !!s.reason && !s.loading);

function goConfirm() { if (s.reason) s.step = 'confirm'; }
function onCancel()  { closeReport(); }
</script>

<template>
  <Teleport to="body">
    <div v-if="s.isOpen" class="rp-backdrop" @click.self="onCancel">
      <div class="rp-modal" role="dialog" aria-modal="true" aria-labelledby="report-title">
        <!-- FORM -->
        <template v-if="s.step === 'form'">
          <header class="rp-header">
            <h3 id="report-title">{{ typeLabel }} 신고</h3>
            <p class="rp-sub">검토 후 적절한 조치를 취하겠습니다.</p>
          </header>

          <section class="rp-body">
            <div class="rp-group">
              <div class="rp-label">신고 사유 선택 <span class="req">*</span></div>
              <ul class="rp-radio-list">
                <li v-for="opt in reasonOptions" :key="opt.value">
                  <label class="rp-radio">
                    <input type="radio" name="report-reason" :value="opt.value" v-model="s.reason">
                    <span>{{ opt.label }}</span>
                  </label>
                </li>
              </ul>
            </div>

            <div class="rp-group">
              <div class="rp-label">상세 내용 (선택)</div>
              <textarea class="rp-textarea" v-model.trim="s.detail" rows="4"
                        placeholder="신고 사유에 대한 자세한 설명을 입력해주세요..." />
              <p class="rp-hint">
                허위 신고 시 제재를 받을 수 있습니다. 신고 내용은 관리자 검토 후 조치합니다.
              </p>
            </div>

            <p v-if="s.error" class="rp-error">{{ s.error }}</p>
          </section>

          <footer class="rp-footer">
            <button class="btn ghost" @click="onCancel">취소</button>
            <button class="btn danger" :disabled="!canContinue" @click="goConfirm">신고하기</button>
          </footer>
        </template>

        <!-- CONFIRM -->
        <template v-else-if="s.step === 'confirm'">
          <header class="rp-header rp-confirm"><h3>정말 {{ typeLabel }}을 신고하시겠습니까?</h3></header>
          <footer class="rp-footer">
            <button class="btn ghost" @click="onCancel">취소</button>
            <button class="btn danger" :disabled="s.loading" @click="submitReport">
              <span v-if="!s.loading">신고하기</span>
              <span v-else>전송 중...</span>
            </button>
          </footer>
        </template>

        <!-- DONE -->
        <template v-else>
          <header class="rp-header rp-done"><h3>{{ typeLabel }} 신고가 완료되었습니다.</h3></header>
          <footer class="rp-footer"><button class="btn primary" @click="onCancel">확인</button></footer>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.rp-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:1000;}
.rp-modal{
  width:420px;max-width:92vw;background:#fff;border-radius:12px;
  box-shadow:0 10px 30px rgba(0,0,0,.2);
  padding:20px 20px 16px;
  overflow:hidden; 
}
.rp-modal *,.rp-modal *::before,.rp-modal *::after{ box-sizing:border-box; }
.rp-header{margin-bottom:12px}
.rp-sub{margin-top:4px;color:#666;font-size:14px}
.rp-body{margin:8px 0 12px}
.rp-group{margin-bottom:14px}
.rp-label{font-weight:600;margin-bottom:8px}
.req{color:#e5484d}
.rp-radio-list{display:grid;gap:8px;list-style:none;padding:0;margin:0}
.rp-radio{display:flex;gap:8px;align-items:center;cursor:pointer}
.rp-textarea{
  width:100%;
  border:1px solid #ddd;border-radius:8px;
 padding:10px;
  font:inherit;resize:vertical;
  box-sizing:border-box; /* 좌우 여백 정확히 맞춤 */
}
.rp-hint{margin-top:8px;font-size:12px;color:#a36f00;background:#fff7e6;border:1px solid #ffe0b2;border-radius:8px;padding:8px}
.rp-error{color:#c62828;background:#ffebee;border:1px solid #ffcdd2;border-radius:8px;padding:8px}
.rp-footer{display:flex;justify-content:flex-end;gap:8px;margin-top:6px}
.btn{border:0;border-radius:8px;padding:10px 14px;font-weight:600;cursor:pointer}
.btn.ghost{background:#f2f2f2}
.btn.danger{background:#e5484d;color:#fff}
.btn.primary{background:#222;color:#fff}
</style>