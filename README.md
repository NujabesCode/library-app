# 📚 우리 반 도서 대출 앱 (팀 에이전트 실습용)

> ⚠️ **연습용 코드입니다.** 리뷰·디버깅 실습을 위해 **일부러 문제를 심어** 두었습니다. 실제 서비스에 쓰지 마세요.

## 실행
Node.js 20 이상만 있으면 됩니다. 설치할 패키지는 없습니다.

```bash
npm start        # http://localhost:3000
npm test         # 테스트 실행
```

## 구조
| 경로 | 하는 일 |
|---|---|
| `server.js` | HTTP 서버, API 라우팅, 정적 파일 제공 |
| `src/books.js` | 검색, 대출, 반납, 연체료 계산 |
| `src/auth.js` | 회원가입, 로그인, 토큰 확인 |
| `public/index.html` | 화면 |
| `data/books.json` | 책 데이터 |
| `test/` | 테스트 (`node --test`) |

## API
| Method | 주소 | 설명 |
|---|---|---|
| GET | `/api/books?q=검색어` | 책 검색 |
| POST | `/api/signup` | `{ username, password }` |
| POST | `/api/login` | `{ username, password }` → `{ token }` |
| POST | `/api/books/:id/borrow` | 대출 (헤더 `Authorization: 토큰`) |
| POST | `/api/books/:id/return` | 반납 → `{ book, fee }` |
