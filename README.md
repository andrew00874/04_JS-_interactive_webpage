# 🛍️ 무진장 쇼핑몰 

현대적이고 사용자 친화적인 온라인 패션 쇼핑몰 웹사이트입니다. 완전한 프론트엔드 기반으로 구현되었으며, 실제 쇼핑몰의 핵심 기능들을 포함하고 있습니다.

##  라이브 데모
**👉 [무진장 쇼핑몰 체험하기](https://mujinjang-mall.vercel.app/)**

## 리포지토리
**[GitHub Repository](https://github.com/andrew00874/04_JS-_interactive_webpage.git)**

## 기능 가이드

### 회원가입 & 로그인
- 메인 페이지에서 "회원가입" 클릭
- 유효성 검사 및 reCAPTCHA 체험
- 회원가입 후 로그인 테스트

### 상품 검색 & 필터링
- 검색창에 상품명 입력 (자동완성 기능)
- 신상품, 베스트, 카테고리별 필터 체험
- 상품 클릭하여 상세 페이지 이동

### 장바구니 기능
- 상품 상세 페이지에서 옵션 선택
- 수량 조절 후 장바구니 담기
- 장바구니 페이지에서 주문 정보 확인

### 게시판 기능
- 게시판 메뉴 클릭
- 로그인 후 "글쓰기" 기능 체험
- 이미지 첨부 및 게시글 작성

### 다크모드
- 헤더의 달 아이콘 클릭하여 테마 변경
- 새로고침 후에도 설정 유지 확인

## 주요 기능

### 회원 관리
- **회원가입**: 유효성 검사, reCAPTCHA 보안 인증, 중복 ID 체크
- **로그인/로그아웃**: 세션 기반 로그인 상태 관리
- **사용자별 데이터**: 개별 장바구니, 게시글 작성자 구분

### 쇼핑 기능
- **상품 목록**: 신상품, 베스트, 카테고리별 필터링
- **상품 상세**: 이미지, 가격, 옵션 선택, 수량 조절
- **장바구니**: 상품 담기, 개인별 장바구니 관리, 주문 요약
- **실시간 검색**: 자동완성 기능이 있는 상품 검색

### 커뮤니티
- **자유 게시판**: 글 작성, 목록 보기, 페이지네이션
- **이미지 업로드**: Cloudinary를 활용한 이미지 첨부
- **게시글 상세**: 펼침/접힘 형태의 상세 보기

### UI/UX
- **다크모드**: 라이트/다크 테마 전환
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **모던 디자인**: 깔끔하고 직관적인 인터페이스

## 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션, CSS 변수
- **JavaScript (ES6+)**: 모던 자바스크립트 문법 활용
- **jQuery 3.7.1**: DOM 조작 및 이벤트 처리

### 외부 서비스
- **Font Awesome**: 아이콘 라이브러리
- **Google Fonts**: Noto Sans KR 폰트
- **Cloudinary**: 이미지 업로드 및 관리
- **Google reCAPTCHA**: 보안 인증

### 데이터 저장
- **localStorage**: 회원정보, 상품 데이터, 게시글 저장
- **sessionStorage**: 로그인 세션 관리

## 프로젝트 구조

```
무진장-쇼핑몰/
│
├── 📄 HTML 파일
│   ├── index.html          # 메인 페이지
│   ├── product.html        # 상품 상세 페이지
│   ├── cart.html          # 장바구니 페이지
│   ├── board.html         # 게시판 페이지
│   ├── write.html         # 글쓰기 페이지
│   ├── signup.html        # 회원가입 페이지
│   ├── about.html         # 회사 소개
│   ├── terms.html         # 이용약관
│   └── policy.html        # 개인정보처리방침
│
├── 📂 css/
│   └── styles.css         # 통합 스타일시트
│
├── 📂 js/
│   ├── main.js           # 메인 페이지 기능
│   ├── product.js        # 상품 상세 기능
│   ├── cart.js           # 장바구니 기능
│   ├── board.js          # 게시판 기능
│   ├── write.js          # 글쓰기 기능
│   └── signup.js         # 회원가입 기능
│
├── 📂 json/
│   └── product.json      # 상품 데이터
│
└── 📂 images/
    └── icon.png          # 사이트 아이콘
```

## 시작하기

### 빠른 체험
**[라이브 데모](https://andrew00874.github.io/04_JS-_interactive_webpage/)**

### 로컬 실행
```bash
# 1. 리포지토리 클론
git clone https://github.com/andrew00874/04_JS-_interactive_webpage.git

# 2. 프로젝트 디렉토리로 이동
cd 04_JS-_interactive_webpage

# 3. 웹 서버 실행 (Live Server, http-server 등)
# 또는 index.html을 브라우저에서 직접 열기
```

### 환경 설정
- **Cloudinary 설정**: `write.js`에서 본인의 Cloudinary 정보로 변경
- **reCAPTCHA 설정**: `signup.html`에서 본인의 사이트 키로 변경

## 주요 특징

### 사용자 경험 최적화
- **즉시 피드백**: 실시간 유효성 검사 및 상태 표시
- **직관적 네비게이션**: 명확한 메뉴 구조와 브레드크럼
- **부드러운 애니메이션**: CSS 트랜지션과 jQuery 애니메이션

### 기술적 특징
- **모듈화된 코드**: 페이지별 JavaScript 파일 분리
- **재사용 가능한 컴포넌트**: 공통 UI 요소의 일관성 유지
- **효율적인 데이터 관리**: 로컬 스토리지 활용한 클라이언트 사이드 데이터베이스

### 크로스 플랫폼 지원
- **완전 반응형**: 모든 디바이스에서 최적화된 경험
- **터치 친화적**: 모바일 기기의 터치 인터페이스 고려
- **브라우저 호환성**: 모던 브라우저 전체 지원

프로젝트 링크: [https://github.com/andrew00874/04_JS-_interactive_webpage](https://github.com/andrew00874/04_JS-_interactive_webpage)

라이브 데모: [https://andrew00874.github.io/04_JS-_interactive_webpage/](https://andrew00874.github.io/04_JS-_interactive_webpage/)

---

**무진장 쇼핑몰**로 현대적이고 완성도 높은 이커머스 경험을 제공합니다.
