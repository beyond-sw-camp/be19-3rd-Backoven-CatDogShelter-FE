<template>
  <div class="donation-detail-page">
    <section class="detail-card">
      <!-- ===== 상단 (목록가기 / 삭제버튼) ===== -->
      <div class="detail-top-row">
        <button class="back-link" @click="goList">← 목록으로</button>

        <button
          v-if="isMyPost"
          class="delete-btn"
          @click="onDeletePost"
        >
          게시글 삭제
        </button>
      </div>

      <!-- ===== 제목 / 메타 ===== -->
      <header class="post-head">
        <h1 class="post-title">{{ post.title }}</h1>

        <ul class="meta-list">
          <!-- 보호소명 뱃지처럼 -->
          <li class="meta-category" v-if="post.shelterName">
            {{ post.shelterName }}
          </li>

          <li class="meta-writer">{{ post.writer }}</li>
          <li class="meta-date">{{ post.createdAt }}</li>
          <li class="meta-view">조회 {{ post.view }}</li>
        </ul>
      </header>

      <!-- ===== 본문 ===== -->
      <div class="post-body">
        <p class="post-content" v-html="formattedContent"></p>
      </div>

      <!-- ===== 액션 버튼들 ===== -->
      <div class="action-row">
        <button class="action-chip">
          🤍 좋아요 {{ post.likeCount }}
        </button>
        <button class="action-chip">🔗 공유하기</button>
        <button class="action-chip report-chip">🚨 신고하기</button>
      </div>

      <!-- ===== 관련 (이전/다음/카테고리 모음 등) ===== -->
      <nav class="related-nav">
        <RouterLink class="related-link" to="/donation">
          ← 긴급 후원 요청 모아보기
        </RouterLink>

        <RouterLink class="related-link" to="/donation">
          필요한 물품 후원 안내 더 보기 →
        </RouterLink>
      </nav>

      <!-- ===== 댓글 영역 ===== -->
      <section class="comment-block">
        <h2 class="comment-title">
          댓글 <span>{{ comments.length }}</span>
        </h2>

        <!-- ✅ 닉네임 입력칸 없음 -->
        <div class="comment-write-area">
          <textarea
            v-model.trim="newComment"
            class="comment-textarea"
            placeholder="댓글을 입력하세요"
          ></textarea>

          <div class="comment-submit-row">
            <button class="comment-submit-btn" @click="submitComment">
              댓글 작성
            </button>
          </div>
        </div>

        <!-- 댓글 리스트 -->
        <ul class="comment-list" v-if="comments.length > 0">
          <li
            v-for="c in comments"
            :key="c.id"
            class="comment-item"
          >
            <div class="comment-meta">
              <span class="comment-writer">{{ c.writer }}</span>
              <span class="comment-date">{{ c.createdAt }}</span>
            </div>
            <p class="comment-content">{{ c.content }}</p>
          </li>
        </ul>

        <div v-else class="no-comment">아직 댓글이 없습니다.</div>
      </section>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'DonationDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const postId = route.params.id

    // 게시글 데이터
    const post = ref({
      id: null,
      title: '',
      content: '',
      shelterName: '', // 보호소명
      writer: '',
      createdAt: '',
      view: 0,
      likeCount: 0
    })

    // 내 글 여부 -> 삭제 버튼 노출 컨트롤
    const isMyPost = ref(false)

    // 댓글 상태
    const comments = ref([])
    const newComment = ref('')

    // 본문 줄바꿈 유지
    const formattedContent = computed(() => {
      return post.value.content.replace(/\n/g, '<br/>')
    })

    // 목록으로 이동
    const goList = () => {
      router.push('/donation')
    }

    // 단건 조회
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/post-service/donation-posts/query/posts/${postId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`
            }
          }
        )

        if (!res.ok) {
          throw new Error('게시글 조회 실패')
        }

        const data = await res.json()

        // ⚠️ 여기서 data의 실제 필드명을 백엔드 DTO에 맞춰 매핑해야 돼.
        // 아래는 예시 매핑이야. 너네 백엔드 응답 구조에 맞춰 키 이름만 바꾸면 됨.
        post.value = {
          id: data.id,
          title: data.title,
          content: data.content,          // 본문
          shelterName: data.shelterName,  // 보호소명 (목록 첫 컬럼)
          writer: data.userName,          // 작성자
          createdAt: data.createdAt,      // 작성일 "2025-09-10 19:10"
          view: data.view,                // 조회수
          likeCount: data.likeCount       // 좋아요 수
        }

        // 내 글인지 여부 세팅 (userId 비교 같은 거)
        // isMyPost.value = data.writerUserId === myUserId
      } catch (err) {
        console.error('[Error] 게시글 조회 실패:', err)
      }
    }

    // 댓글 목록 조회
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/post-service/donation-posts/query/posts/${postId}/comments`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`
            }
          }
        )

        if (!res.ok) {
          throw new Error('댓글 조회 실패')
        }

        const list = await res.json()

        // list 배열의 각 요소를 화면용으로 변환
        comments.value = list.map(item => ({
          id: item.id,
          writer: item.userName,
          createdAt: item.createdAt,
          content: item.content
        }))
      } catch (err) {
        console.error('[Error] 댓글 조회 실패:', err)
      }
    }

    // 댓글 작성
    const submitComment = async () => {
      if (!newComment.value) return

      try {
        const res = await fetch(
          `http://localhost:8000/post-service/donation-posts/query/posts/${postId}/comments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`
            },
            body: JSON.stringify({
              content: newComment.value
            })
          }
        )

        if (!res.ok) {
          throw new Error('댓글 작성 실패')
        }

        newComment.value = ''
        fetchComments()
      } catch (err) {
        console.error('[Error] 댓글 작성 실패:', err)
      }
    }

    // 글 삭제
    const onDeletePost = async () => {
      const ok = confirm('정말 삭제하시겠습니까?')
      if (!ok) return

      try {
        const res = await fetch(
          `http://localhost:8000/post-service/donation-posts/query/posts/${postId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`
            }
          }
        )

        if (!res.ok) {
          throw new Error('삭제 실패')
        }

        router.push('/donation')
      } catch (err) {
        console.error('[Error] 게시글 삭제 실패:', err)
      }
    }

    onMounted(() => {
      fetchPost()
      fetchComments()
    })

    return {
      post,
      comments,
      newComment,
      formattedContent,
      isMyPost,
      goList,
      submitComment,
      onDeletePost
    }
  }
}
</script>

<style scoped>
.donation-detail-page {
  background-color: #f5efe6;
  padding: 24px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.detail-card {
  background-color: #fffdf8;
  border: 1px solid rgba(120, 72, 24, 0.15);
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  font-family: 'Pretendard', system-ui, -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif;
}

.detail-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.back-link {
  background: none;
  border: 0;
  color: #4a3726;
  font-size: 16px;
  line-height: 1.4;
  cursor: pointer;
  padding: 0;
}

.delete-btn {
  background-color: #fff4f1;
  border: 1px solid #e9a091;
  border-radius: 8px;
  font-size: 14px;
  padding: 8px 12px;
  color: #8a3a2b;
  cursor: pointer;
}

.post-head {
  margin-bottom: 20px;
}

.post-title {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
  color: #2f2010;
  word-break: keep-all;
  margin-bottom: 16px;
}

.meta-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  font-size: 14px;
  color: #6a5642;
  line-height: 1.4;
}

.meta-category {
  background-color: #f3e7d9;
  color: #4a3726;
  border-radius: 999px;
  padding: 4px 10px;
  font-weight: 500;
  font-size: 13px;
}

.meta-writer,
.meta-date,
.meta-view {
  color: #6a5642;
}

.post-body {
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.6;
  color: #3b2a18;
  white-space: pre-line;
  word-break: break-word;
}

.post-content {
  font-size: 16px;
  line-height: 1.7;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.action-chip {
  background-color: #fff;
  border: 1px solid rgba(120, 72, 24, 0.3);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 14px;
  line-height: 1.3;
  color: #4a3726;
}

.report-chip {
  background-color: #fff6f6;
  border-color: #d88a7c;
  color: #8a3a2b;
}

.related-nav {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-top: 1px solid rgba(120, 72, 24, 0.15);
  border-bottom: 1px solid rgba(120, 72, 24, 0.15);
  padding: 16px 0;
  margin-bottom: 24px;
}
.related-link {
  color: #1a0dab;
  text-decoration: underline;
  font-size: 16px;
  line-height: 1.4;
}

.comment-block {
  background-color: #fdfaf4;
  border-radius: 10px;
  border: 1px solid rgba(120,72,24,0.12);
  padding: 16px;
  margin-bottom: 16px;
}

.comment-title {
  font-size: 18px;
  font-weight: 600;
  color: #3b2a18;
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.comment-write-area {
  background-color: #fffefc;
  border: 1px solid rgba(120,72,24,0.2);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.comment-textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  border: 0;
  outline: 0;
  font-size: 15px;
  line-height: 1.5;
  color: #2f2010;
  background-color: transparent;
}

.comment-submit-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.comment-submit-btn {
  background-color: #d5b28e;
  border: 1px solid #a27643;
  color: #fff;
  font-size: 14px;
  line-height: 1.4;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  background-color: #fffefc;
  border-radius: 8px;
  border: 1px solid rgba(120,72,24,0.15);
  padding: 12px 14px;
}

.comment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  font-size: 13px;
  color: #6a5642;
  line-height: 1.4;
  margin-bottom: 6px;
}

.comment-writer {
  font-weight: 600;
  color: #4a3726;
}

.comment-content {
  font-size: 15px;
  line-height: 1.5;
  color: #3b2a18;
  white-space: pre-line;
}

.no-comment {
  font-size: 14px;
  color: #8b7a67;
  text-align: center;
  padding: 24px 0;
}
</style>