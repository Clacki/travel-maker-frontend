# Button

```tsx
import { Button, IconButton } from '@/components/common/button'
;<Button variant="primary" size="md">
  수정 완료
</Button>
;<Button variant="primary" size="lg" shape="pill">
  추천 여행지 보러가기 →
</Button>
;<Button variant="outline" size="md">
  취소
</Button>
;<Button variant="secondary" size="md">
  테스트 다시하기
</Button>
;<Button variant="neutral" size="md">
  리뷰 쓰기
</Button>
;<IconButton aria-label="공유하기">
  <ShareIcon />
</IconButton>
```

`LikeButton`은 좋아요 상태, API 연동, `aria-pressed` 책임을 포함하므로 별도 컴포넌트로 분리해 구현합니다.
