// src/views/Post/detail/dummies.js

// 이미지 자동 로딩: ../image/ 폴더에 있는 파일을 맵으로
const glob = import.meta.glob('../image/*', { eager: true })
const IMG = {}
for (const [path, mod] of Object.entries(glob)) {
  const file = path.split('/').pop()
  IMG[file] = mod.default || mod
}

// id-1.jpg, id-2.jpg ... 순서대로 존재하는 이미지를 찾는다
function imagesFor(id, max = 6) {
  const out = []
  const exts = ['jpg', 'jpeg', 'png', 'webp', 'gif']
  for (let i = 1; i <= max; i++) {
    let found = null
    for (const ext of exts) {
      const name = `${id}-${i}.${ext}`
      if (IMG[name]) { found = IMG[name]; break }
    }
    if (!found) break
    out.push(found)
  }
  return out
}

/**
 * 지금 목록(33~24)과 동일한 10개
 * 제목/작성자/날짜/카테고리만 목록과 동일하게 맞춰두었고,
 * 본문은 짧은 문단 더미입니다.
 */
const RAW = [
  { id: 33, category: '강아지', title: '우리집 강아지 산책 코스 추천', author: '박지수',  date: '2025-10-01',
    content: [
      '우리 동네 산책 코스를 공유합니다. 그늘과 물 있는 코스를 위주로 다녀요.',
      '초보 보호자분들께도 부담 없는 평지 루트가 좋아요.'
    ]
  },
  { id: 32, category: '강아지', title: '강아지 리드줄 추천 부탁해요',   author: '김민준',  date: '2025-10-02',
    content: [
      '처음 쓰는 리드줄이라 길이/소재가 고민입니다.',
      '경험담과 제품 추천 부탁드려요!'
    ]
  },
  { id: 31, category: '강아지', title: '강아지 배변패드 뭐가 좋아요?',   author: '이서연',  date: '2025-10-03',
    content: [
      '흡수력/탈취 잘 되는 제품 위주로 찾고 있어요.',
      '가성비 제품도 추천 환영!'
    ]
  },
  { id: 30, category: '강아지', title: '강아지 사회화 팁 모음',       author: '정다훈',  date: '2025-10-04',
    content: [
      '낯선 환경 적응시키는 법, 산책 예절, 다른 견과의 인사 등 체크리스트 정리했습니다.'
    ]
  },
  { id: 29, category: '강아지', title: '겨울 산책 복장 추천',         author: '최수빈',  date: '2025-10-05',
    content: [
      '보온성 좋은 하네스/방한 조끼 추천받습니다.',
      '발바닥 보호를 위한 부츠도 고민 중이에요.'
    ]
  },
  { id: 28, category: '강아지', title: '첫 목욕 생존기 공유',          author: '오슬기',  date: '2025-10-06',
    content: [
      '샴푸부터 말리기까지 첫 목욕하며 배운 꿀팁을 정리했어요.'
    ]
  },
  { id: 27, category: '강아지', title: '사료 바꾸고 설사 멈췄어요',     author: '류하늘',  date: '2025-10-07',
    content: [
      '알레르기 의심으로 사료를 바꿨더니 확실히 나아졌습니다.',
      '천천히 전환하는 게 포인트였어요.'
    ]
  },
  { id: 26, category: '강아지', title: '하네스 vs 목줄 뭐 쓰세요?',     author: '윤태호',  date: '2025-10-08',
    content: [
      '각각 장단점이 궁금합니다. 초보에게는 어떤 게 더 나을까요?'
    ]
  },
  { id: 25, category: '강아지', title: '강아지 치석 관리 어떻게?',       author: '고예린',  date: '2025-10-09',
    content: [
      '덴탈껌/칫솔/스케일링 중에 현실적으로 꾸준히 하기 좋은 방법이 뭘까요?'
    ]
  },
  { id: 24, category: '고양이', title: '고양이 간식 추천 받아요',       author: '한지훈',  date: '2025-10-10',
    content: [
      '저알레르기/저지방 간식 위주로 추천 부탁드립니다.',
      '선호/비선호 성분도 알려주세요.'
    ]
  },
]

// 상세 객체 생성
const makeDetail = (r) => {
  const imgs = imagesFor(r.id)
  return {
    id: r.id,
    board: 'free',
    title: r.title,
    category: r.category,
    author: { name: r.author, role: '' },
    date: r.date,
    stats: { views: 0, likes: 0, comments: 0 },
    images: imgs.map((src, i) => ({ src, alt: `${r.title} 이미지 ${i + 1}` })),
    content: r.content,
    prev: null, next: null,
    comments: [],
    attachments: [],
    tags: [],
  }
}

// 맵 구성
const MAP = Object.fromEntries(RAW.map(r => [r.id, makeDetail(r)]))

// prev/next : 왼쪽(-1) / 오른쪽(+1) 보장 (id 오름차순으로 연결)
const ORDER = RAW.map(r => r.id).sort((a, b) => a - b)
for (let i = 0; i < ORDER.length; i++) {
  const id = ORDER[i]
  const prevId = ORDER[i - 1] ?? null // 더 작은 id
  const nextId = ORDER[i + 1] ?? null // 더 큰 id
  if (prevId) MAP[id].prev = { id: prevId, title: MAP[prevId].title }
  if (nextId) MAP[id].next = { id: nextId, title: MAP[nextId].title }
}

export function getDummyDetail(id) {
  const d = MAP[id]
  return d ? JSON.parse(JSON.stringify(d)) : null
}

export function getDummyThumb(id) {
  const d = MAP[id]
  return d && d.images?.[0]?.src ? d.images[0].src : ''
}
