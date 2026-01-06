# 📖 한우리 다이어리 (Hanwoori Diary)

한우리 다이어리는 Node.js와 Express를 기반으로 한 웹 기반 다이어리 애플리케이션입니다. 사용자는 일기를 작성, 조회, 수정, 삭제할 수 있으며, 로그인 기능을 통해 사용자 정보를 확인할 수 있습니다.

## ✨ 주요 기능

- 📝 **다이어리 관리**: 일기 작성, 조회, 수정, 삭제
- 🔍 **사용자 조회**: 로그인 시 사용자 타입 정보 확인
- 📊 **목록 조회**: 작성된 모든 다이어리 목록 확인
- 🔍 **상세 보기**: 개별 다이어리 상세 내용 확인
- ✏️ **실시간 수정**: AJAX를 통한 비동기 수정 기능
- 🗑️ **삭제 기능**: 다이어리 삭제 기능

## 🛠️ 기술 스택

### Backend
- **Node.js** - JavaScript 런타임
- **Express.js** - 웹 프레임워크
- **MySQL** - 관계형 데이터베이스
- **MyBatis Mapper** - SQL 매핑 프레임워크

### Frontend
- **EJS** - 템플릿 엔진
- **JavaScript (Vanilla)** - 클라이언트 사이드 스크립팅
- **AJAX** - 비동기 통신

## 📁 프로젝트 구조

```
diary-for-web/
├── app.js                 # Express 애플리케이션 진입점
├── package.json           # 프로젝트 의존성 및 스크립트
├── src/
│   ├── config/
│   │   └── database.js    # 데이터베이스 연결 설정
│   ├── controllers/       # 컨트롤러 계층
│   │   ├── auth.controller.js
│   │   └── main.controller.js
│   ├── services/          # 서비스 계층 (비즈니스 로직)
│   │   ├── auth.services.js
│   │   ├── main.services.js
│   │   └── index.js
│   ├── dao/               # 데이터 접근 계층
│   │   ├── common.dao.js
│   │   └── mapper/
│   │       ├── auth.xml
│   │       └── main.xml
│   └── routes/            # 라우팅 설정
│       ├── index.js
│       ├── auth.route.js
│       └── main.route.js
└── view/                  # EJS 템플릿 파일
    ├── auth/
    │   └── login.ejs
    ├── main.ejs
    └── detail.ejs
```

## 🚀 시작하기

### 필수 요구사항

- Node.js (v14 이상)
- MySQL (v8.0 이상)
- npm 또는 yarn

### 설치 방법

1. **저장소 클론**
   ```bash
   git clone https://github.com/junSeockYoon/hanwori-diary-for-web.git
   cd hanwori-diary-for-web
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **데이터베이스 설정**
   - MySQL 데이터베이스 생성 및 테이블 생성 (아래 "데이터베이스 스키마" 섹션 참조)
   - `src/config/database.js` 파일에서 데이터베이스 연결 정보 설정
   ```javascript
   // src/config/database.js 예시
   host: 'localhost',
   user: 'your_username',
   password: 'your_password',
   database: 'diary_db'
   ```

4. **서버 실행**
   ```bash
   # 개발 모드 (nodemon 사용)
   npm run dev
   
   # 프로덕션 모드
   npm start
   ```

5. **브라우저에서 접속**
   ```
   http://localhost:3001
   ```

## 📝 API 엔드포인트

### 인증 (Auth)
- `GET /auth/login` - 로그인 페이지 렌더링
- `POST /auth/api/login` - 사용자 정보 조회 (아이디와 비밀번호로 사용자 타입 확인)

### 다이어리 (Main)
- `GET /` - 다이어리 목록 페이지
- `GET /detail/:id` - 다이어리 상세 페이지
- `POST /update/:id` - 다이어리 수정
- `POST /delete/:id` - 다이어리 삭제

## 🗄️ 데이터베이스 스키마

### 데이터베이스 생성

```sql
CREATE DATABASE diary_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE diary_db;
```

### users 테이블

사용자 정보를 저장하는 테이블입니다.

```sql
CREATE TABLE `users` (
  `user_cd` INT NOT NULL AUTO_INCREMENT COMMENT '유저 고유 코드 (PK)',
  `user_id` VARCHAR(50) NOT NULL UNIQUE COMMENT '유저 로그인 아이디',
  `pw` VARCHAR(255) NOT NULL COMMENT '비밀번호 (반드시 해시하여 저장)',
  `user_type` VARCHAR(20) DEFAULT 'user' COMMENT '유저 타입 (예: admin, user)',
  `use_yn` CHAR(1) DEFAULT 'Y' COMMENT '사용 여부 (Y/N, N=탈퇴 처리)',
  `create_dt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `modify_dt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  PRIMARY KEY (`user_cd`),
  UNIQUE KEY `UK_user_id` (`user_id`)
) COMMENT '유저 정보 테이블';
```

### posts 테이블

다이어리 게시글 정보를 저장하는 테이블입니다.

```sql
CREATE TABLE `posts` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '게시글 고유 코드 (PK)',
  `title` VARCHAR(255) NOT NULL COMMENT '게시글 제목',
  `content` TEXT NOT NULL COMMENT '게시글 내용',
  `use_yn` CHAR(1) DEFAULT 'Y' COMMENT '사용 여부 (Y/N, N=삭제 처리)',
  `create_dt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `modify_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  PRIMARY KEY (`id`)
) COMMENT '게시글 정보 테이블';
```

### 샘플 데이터 INSERT

#### users 테이블 샘플 데이터

```sql
-- 관리자 계정 (비밀번호는 실제 사용 시 bcrypt로 해시하여 저장해야 합니다)
INSERT INTO `users` (`user_id`, `pw`, `user_type`, `use_yn`) 
VALUES ('admin', '$2b$10$YourHashedPasswordHere', 'admin', 'Y');

-- 일반 사용자 계정
INSERT INTO `users` (`user_id`, `pw`, `user_type`, `use_yn`) 
VALUES ('user01', '$2b$10$YourHashedPasswordHere', 'user', 'Y');
```

**주의**: 위의 `$2b$10$YourHashedPasswordHere`는 예시입니다. 실제로는 bcrypt를 사용하여 비밀번호를 해시한 값을 저장해야 합니다.

#### posts 테이블 샘플 데이터

```sql
-- 샘플 다이어리 게시글
INSERT INTO `posts` (`title`, `content`, `use_yn`) 
VALUES ('오늘의 일기', '오늘은 날씨가 좋았다. 산책을 다녀왔다.', 'Y');

INSERT INTO `posts` (`title`, `content`, `use_yn`) 
VALUES ('주말 계획', '이번 주말에는 책을 읽고 영화를 보려고 한다.', 'Y');

INSERT INTO `posts` (`title`, `content`, `use_yn`) 
VALUES ('새로운 시작', '새로운 프로젝트를 시작했다. 기대가 된다!', 'Y');
```

### 비밀번호 해시 생성 방법

Node.js에서 bcrypt를 사용하여 비밀번호를 해시하는 방법:

```javascript
const bcrypt = require('bcrypt');

// 비밀번호 해시 생성
const plainPassword = 'your_password_here';
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
    if (err) {
        console.error('해시 생성 오류:', err);
        return;
    }
    console.log('해시된 비밀번호:', hash);
    // 이 해시 값을 데이터베이스에 저장하세요
});
```

## 🔐 로그인 기능

현재 구현된 로그인 기능은 다음과 같습니다:

- **로그인 페이지**: 사용자가 아이디와 비밀번호를 입력할 수 있는 페이지 제공
- **사용자 정보 조회**: 입력된 아이디와 비밀번호로 데이터베이스에서 사용자 타입(`user_type`)을 조회
- **응답**: 조회된 사용자 정보를 JSON 형태로 반환

**참고**: 현재는 세션 관리나 인증 미들웨어가 구현되지 않아, 로그인 후에도 모든 페이지에 접근 가능합니다. 향후 세션 기반 인증이나 JWT 토큰 기반 인증을 추가할 수 있습니다.

## 🎨 UI/UX 특징

- 모던하고 깔끔한 디자인
- 반응형 레이아웃
- 직관적인 사용자 인터페이스
- 실시간 피드백 메시지
- 로그인 페이지 디자인

## 📦 주요 의존성

```json
{
  "ejs": "^3.1.10",
  "express": "^5.1.0",
  "mybatis-mapper": "^0.8.0",
  "mysql2": "^3.14.5"
}
```

## 🏗️ 아키텍처

이 프로젝트는 **MVC (Model-View-Controller)** 패턴을 따릅니다:

- **Model**: DAO 계층 (데이터베이스 접근)
- **View**: EJS 템플릿 (사용자 인터페이스)
- **Controller**: 컨트롤러 계층 (요청 처리)
- **Service**: 서비스 계층 (비즈니스 로직)

## 🔄 데이터 흐름

1. **요청**: 클라이언트가 라우터를 통해 요청
2. **컨트롤러**: 요청을 받아 서비스 계층 호출
3. **서비스**: 비즈니스 로직 처리 후 DAO 호출
4. **DAO**: MyBatis Mapper를 통해 SQL 실행
5. **응답**: 결과를 컨트롤러 → 뷰 또는 JSON으로 반환

## 📄 라이선스

이 프로젝트는 ISC 라이선스를 따릅니다.

## 👤 작성자

- **junSeockYoon** - [GitHub](https://github.com/junSeockYoon)

## 🙏 감사의 말

이 프로젝트를 사용해주셔서 감사합니다!

---

**Made with ❤️ by junSeockYoon**
