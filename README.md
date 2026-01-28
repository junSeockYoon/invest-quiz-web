## 📊 CQ Level Test (Investment Quiz for Web)

투자 지능을 OX 퀴즈로 측정하는 **CQ(Level of Investment Intelligence) 테스트 웹 애플리케이션**입니다.  
사용자는 연속된 OX 문제를 풀고, 최종 점수와 등급(S ~ D)을 결과 화면에서 확인할 수 있습니다.

이 프로젝트는 로컬에서 개발·실행한 코드를 원격 저장소  
[`junSeockYoon/invest-quiz-web`](https://github.com/junSeockYoon/invest-quiz-web.git)에 연동하여 사용하는 것을 기준으로 합니다.

---

## ✨ 주요 기능

- **메인 랜딩 페이지**
  - 모바일 감성의 단일 페이지 UI
  - `투자 지능 테스트 하기` 버튼을 통해 레벨 테스트로 이동
- **레벨 테스트**
  - 5문항 OX 퀴즈로 투자 지능 간편 측정
  - 완료 후 결과 화면(등급, 정답률, 소요 시간) 표시 후 관심사 선택으로 이어짐
- **관심분야 선택**
  - 레벨 테스트 결과 후 관심 챕터(환율, 금리, 외환 등)를 키워드 버튼으로 다중 선택
  - 선택한 관심사는 챕터 목록 화면에서 상단에 파란색 강조로 표시
- **투자 지능 OX 퀴즈**
  - 서버에서 가져온 문제 리스트를 기반으로 순차 진행
  - 챕터(환율, 금리, 인플레이션 등) 정보와 설명 표시
  - 진행률(progress bar) 애니메이션 및 부드러운 전환 효과
- **결과 저장 및 등급 산출**
  - 사용자의 OX 선택을 바탕으로 총 정답 수 계산 (최대 56문항 기준)
  - 정답 수에 따라 **S, A, B, C, D 등급** 산출
  - 결과 요약(점수, 정답률, 등급)과 테스트 일시, 가상의 사용자명 저장
- **결과 조회 페이지**
  - `/test/result/:id` URL로 특정 결과를 조회
  - 점수/정답률/등급별 색상, 게이지 바, 등급 기준 설명 제공
- **로그 관리**
  - `winston`, `winston-daily-rotate-file`을 이용한 일별 로그 관리
  - `logs/info`, `logs/error` 디렉터리에 로그 파일 기록

---

## 🛠️ 기술 스택

### Backend
- **Node.js / Express.js** – 웹 서버 및 라우팅
- **MySQL** – 퀴즈/결과 데이터 저장
- **mybatis-mapper** – XML 기반 SQL 매퍼
- **winston** – 로깅

### Frontend
- **EJS** – 서버 사이드 템플릿
- **Vanilla JavaScript** – 퀴즈 로직 (`public/js/quiz.js`)
- **Tailwind CSS (CDN)** – 모바일 앱 느낌의 UI 스타일링

---

## 📁 프로젝트 구조

프로젝트 루트는 `investment-quiz-for-web/`입니다.

```text
investment-quiz-for-web/
├── app.js                  # Express 앱 엔트리 포인트 (포트: 3001)
├── package.json            # 의존성 및 실행 스크립트
├── public/
│   └── js/
│       └── quiz.js         # 클라이언트 퀴즈 로직
├── src/
│   ├── common/
│   │   └── utils/          # 공통 유틸 (날짜, 암호화, 세션 등)
│   ├── config/
│   │   ├── app.config.js   # 앱 공통 설정
│   │   ├── color.config.js # 색상 관련 설정
│   │   ├── database.js     # DB 연결 설정
│   │   └── logger.js       # winston 로거 설정
│   ├── controllers/
│   │   ├── main.controller.js  # 메인 랜딩 페이지 컨트롤러
│   │   ├── test.controller.js  # 퀴즈/레벨테스트/관심사/챕터 컨트롤러
│   │   └── admin.controller.js # 관리자 컨트롤러
│   ├── services/
│   │   ├── index.js        # 서비스 인덱스
│   │   ├── main.services.js# (기존 예제용 서비스 – 필요시 확장)
│   │   └── test.services.js# 퀴즈 로직 및 결과 저장/조회 서비스
│   ├── dao/
│   │   ├── common.dao.js   # 공통 DAO 호출 래퍼
│   │   └── mapper/
│   │       ├── main.xml    # 예제용 쿼리 매퍼
│   │       └── test.xml    # 퀴즈/결과 관련 쿼리 매퍼
│   ├── models/
│   │   └── common/         # 결과 모델(ResultModel 등)
│   └── routes/
│       ├── index.js        # 라우트 엔트리 (/, /test, /admin 등록)
│       ├── main.route.js   # 메인 페이지 라우트
│       ├── test.route.js   # 퀴즈/레벨테스트/관심사/챕터 라우트
│       └── admin.route.js  # 관리자 라우트
└── view/
    ├── main.ejs            # 메인 랜딩 페이지 (CQ LEVEL TEST)
    └── test/
        ├── main.ejs        # 퀴즈 화면 (챕터별)
        ├── chapters.ejs    # 챕터 선택 화면
        ├── interests.ejs   # 관심사 선택 화면
        ├── level.ejs       # 레벨 테스트 화면
        ├── level-result.ejs# 레벨 테스트 결과 화면
        └── result.ejs      # 결과 화면
```

---

## 🚀 시작하기

### 1. 필수 요구사항

- Node.js (v14 이상 권장)
- MySQL (v8.0 이상 권장)
- npm

### 2. 프로젝트 클론

```bash
git clone https://github.com/junSeockYoon/invest-quiz-web.git
cd invest-quiz-web
```

> GitHub 저장소는 현재 비어 있을 수 있지만, 로컬 프로젝트를 위 경로와 연동해서 사용하면 됩니다.  
> (로컬에서 작업 후 `git remote add origin` 및 `git push`로 업로드)

### 3. 의존성 설치

```bash
npm install
```

### 4. 데이터베이스 설정

1. MySQL에 데이터베이스 생성
2. 퀴즈 문제/결과/결과 상세를 저장할 테이블을 생성  
   (구체적인 DDL은 `src/dao/mapper/test.xml`에 정의된 쿼리를 참고해 구성)
3. `src/config/database.js` 파일에서 DB 접속 정보를 실제 환경에 맞게 수정

```js
// src/config/database.js 예시
host: 'localhost',
user: 'your_username',
password: 'your_password',
database: 'investment_quiz_db'
```

### 5. 서버 실행

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:3001
```

---

## 📝 주요 라우트 / API

### View 라우트

- `GET /`
  - 메인 랜딩 페이지(`view/main.ejs`) 렌더링
  - CQ LEVEL TEST 소개 및 "투자 지능 테스트 하기" 버튼 제공

- `GET /test`
  - 퀴즈 페이지(`view/test/main.ejs`) 렌더링
  - 서버에서 조회한 퀴즈 데이터(`testService.main()`)를 `serverQuizData`로 주입

- `GET /test/result/:id`
  - 특정 결과 ID에 대한 결과 페이지(`view/test/result.ejs`) 렌더링
  - 점수, 등급, 정답률, 테스트 날짜 등 표시

### API 라우트

- `POST /test/submit`
  - Body(JSON):
    - `totalScore`: 정답 개수
    - `grade`: 산출된 등급(S/A/B/C/D)
    - `details[]`: 각 문항별 `{ questionNum, userAnswer, isCorrect }`
  - 동작:
    - 마지막 유저 번호 조회 후 `USER_번호` 형식의 사용자명 생성
    - 결과 및 상세 결과를 DB에 저장
    - 성공 시 `resultId`, `userName`을 포함한 JSON 반환

---

## 🎨 UI/UX 특징

- 모바일 화면 기준으로 디자인된 단일 페이지 구조
- Tailwind CSS를 통한 **모던하고 부드러운 인터랙션**
- 진행 바 애니메이션, 페이드 인/아웃 전환 효과
- 등급별 색상(보라/파랑/초록/주황/빨강)로 시각적 구분

---

## 📦 주요 의존성

```json
{
  "ejs": "^3.1.10",
  "express": "^5.1.0",
  "mybatis-mapper": "^0.8.0",
  "mysql2": "^3.14.5",
  "winston": "^3.11.0"
}
```

그 외에도 `bcrypt`, `cookie-parser`, `lodash`, `moment`, `uuid`, `winston-daily-rotate-file` 등을 사용하여 확장 가능한 구조를 갖추고 있습니다.

---

## 🏗️ 아키텍처 & 데이터 흐름

이 프로젝트는 **MVC + Service + DAO 레이어드 아키텍처**를 따릅니다.

- **Controller**: 요청을 받고 서비스 호출 (`src/controllers`)
- **Service**: 비즈니스 로직 및 DAO 호출 (`src/services`)
- **DAO**: `commonDao` + MyBatis 스타일 XML 매퍼 (`src/dao`)
- **View**: EJS 템플릿 렌더링 (`view`)

데이터 흐름:
1. 사용자가 `/test` 진입 → 서버에서 퀴즈 데이터 조회 후 EJS에 주입
2. 클라이언트에서 OX 선택 → `quiz.js`가 결과를 집계
3. `POST /test/submit`으로 결과 전송 → DB 저장 → `resultId` 반환
4. 클라이언트는 `/test/result/:id`로 리다이렉트 → 결과 화면 렌더링

---

## 📄 라이선스 & 작성자

- 라이선스: ISC
- 작성자: **junSeockYoon** – [GitHub 프로필](https://github.com/junSeockYoon)

---

**Made with ❤️ for CQ Level Test (Investment Quiz for Web)** by **junSeockYoon**
