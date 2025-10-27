<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { signup, useAuth } from '../../useAuth'

const router = useRouter()
const { loading, error } = useAuth()

const regions = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시',
  '세종특별자치시', '경기도', '강원특별자치도', '충청북도', '충청남도',
  '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
]

const form = ref({
  name: '',
  username: '',
  password: '',
  password2: '',
  email: '',
  phone: '',
  region: '',
  address: '',
  agree: false
})

const pwOk = computed(
  () => form.value.password.length >= 6 && form.value.password === form.value.password2
)

const submit = async () => {
  if (!pwOk.value) return
  if (!form.value.agree) {
    alert('약관에 동의해 주세요.')
    return
  }

  const ok = await signup({
    role: 'USER',
    name: form.value.name.trim(),
    username: form.value.username.trim(),
    password: form.value.password,
    email: form.value.email.trim(),
    phone: form.value.phone.trim(),
    region: form.value.region,
    address: form.value.address.trim()
  })

  if (ok) router.push({ name: 'login' })
}
</script>

<template>
  <section class="wrap">
    <div class="card">
      <header class="head">
        <button class="back" type="button" @click="router.push({ name: 'login' })">
          <svg viewBox="0 0 20 20" width="18" height="18">
            <path d="M12 4L6 10l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          로그인으로
        </button>
        <img class="logo" src="@/assets/logo.svg" alt="안냥보호센터" />
        <h2>회원가입</h2>
      </header>

      <form class="form" @submit.prevent="submit" novalidate>
        <div class="row2">
          <label class="field">
            <span>이름 *</span>
            <input v-model.trim="form.name" required />
          </label>
          <label class="field">
            <span>아이디 *</span>
            <input v-model.trim="form.username" required minlength="4" placeholder="영문/숫자 4자 이상" />
          </label>
        </div>

        <div class="row2">
        <label class="field">
            <span>비밀번호 *</span>
            <input v-model="form.password" type="password" required minlength="6" placeholder="6자 이상" />
            <!-- 높이 맞춤용 빈 힌트 -->
            <small class="hint blank">placeholder</small>
        </label>

        <label class="field">
            <span>비밀번호 확인 *</span>
            <input v-model="form.password2" type="password" required minlength="6" />
            <small class="hint" :class="{ ok: pwOk, bad: !pwOk && form.password2 }">
            {{ pwOk ? '비밀번호가 일치합니다.' : (form.password2 ? '비밀번호가 일치하지 않습니다.' : '') }}
            </small>
        </label>
        </div>

        <label class="field full">
          <span>이메일 *</span>
          <input v-model.trim="form.email" type="email" required placeholder="example@mail.com" />
        </label>

        <div class="row2">
        <label class="field full">
            <span>연락처</span>
            <input v-model.trim="form.phone" inputmode="tel" placeholder="010-0000-0000" />
            </label>

            <!-- 거주지역: 한 줄 전체 + 드롭다운 데이터 바인딩 유지 -->
            <label class="field full">
            <span>거주지역</span>
            <select v-model="form.region">
                <option value="">선택</option>
                <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
            </select>
        </label>
        </div>

        <label class="field full">
          <span>주소</span>
          <input v-model.trim="form.address" placeholder="도로명 주소" />
        </label>

        <label class="agree full">
          <input type="checkbox" v-model="form.agree" />
          <span>개인정보 처리 및 이용약관에 동의합니다. *</span>
        </label>

        <button class="submit full" type="submit" :disabled="loading || !pwOk">회원가입</button>

        <p v-if="error" class="error full" role="alert">
          {{ error }}
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
/* Layout */
.wrap {
  display: grid;
  place-items: center;
  padding: 40px 16px;
  background: #efe6d7;
  min-height: 100%;
}

.card {
  --card-w: 520px;
  --gutter: 24px;
  --ctl-h: 42px;
  width: var(--card-w);
  max-width: 92vw;
  background: #fff;
  border-radius: 16px;
  padding: 24px var(--gutter) 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .08);
  position: relative;
}

.head {
  text-align: center;
  margin-bottom: 10px;
}

.logo {
  width: 56px;
  height: 56px;
  margin: 6px auto 4px;
  display: block;
}

h2 {
  margin: 6px 0 0;
  font-size: 22px;
}

.back {
  position: absolute;
  left: 16px;
  top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #eadfcd;
  border-radius: 8px;
  background: #fff;
  color: #6b5b4a;
  cursor: pointer;
}

/* Form grid */
.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.form .row2 {
  display: contents;
}
.field,
.agree {
  display: grid;
  gap: 6px;
}
.field > span {
  font-size: 12px;
  color: #666;
}
.full {
  grid-column: 1 / -1;
}

/* Controls */
input,
select,
textarea,
button.submit {
  height: var(--ctl-h);
  padding: 0 14px;
  border: 1px solid #e1e1e1;
  border-radius: 10px;
  background: #fafafa;
  outline: none;
  box-sizing: border-box;
}
textarea {
  padding-top: 10px;
  padding-bottom: 10px;
  min-height: 120px;
}
input:focus,
select:focus,
textarea:focus {
  border-color: #d1b57a;
  background: #fff;
}

/* Hint / error */
.hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  min-height: 14px;
}
.error {
  text-align: center;
  color: #d33;
  font-size: 13px;
  margin-top: 4px;
}

/* Agree */
.agree {
  align-items: center;
  grid-auto-flow: column;
  justify-content: start;
  gap: 8px;
}
.agree input[type='checkbox'] {
  width: 18px;
  height: 18px;
}
.agree span {
  font-size: 12px;
  color: #777;
}

/* Button */
button.submit {
  border: 0;
  background: #1c1c1c;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
button.submit:disabled {
  opacity: .6;
  cursor: default;
}

/* Responsive */
@media (max-width: 560px) {
  .form {
    grid-template-columns: 1fr;
  }
  .full {
    grid-column: 1 / 2;
  }
}
</style>
