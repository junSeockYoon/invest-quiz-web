

// ========================================
// 1. 필요한 모듈들 가져오기 (Import)
// ========================================

// Express.js 프레임워크 - Node.js용 웹 서버 프레임워크
const express = require('express')

// Express 애플리케이션 인스턴스 생성
const app = express()

// 서버가 실행될 포트 번호 설정
const port = 3001

// 라우터 모듈 가져오기 - URL 경로별로 요청을 처리하는 로직
const routes = require('./src/routes/index')

// Node.js 내장 모듈 - 파일 경로를 다루는 유틸리티
const path = require('path');

// cookie-parser 모듈 가져오기
const cookieParser = require('cookie-parser');


// ========================================
// 2. 뷰 엔진 설정 (Template Engine)
// ========================================

// EJS 템플릿 파일들이 저장된 폴더 경로 설정
// __dirname: 현재 파일이 위치한 디렉토리 경로
app.set('views', path.join(__dirname, 'view'));

// EJS를 뷰 엔진으로 사용하겠다고 설정
// EJS: HTML에 JavaScript 코드를 삽입할 수 있는 템플릿 엔진
app.set('view engine', 'ejs');

// ========================================
// 3. 미들웨어 설정 (Middleware)
// ========================================

// JSON 요청 파싱 미들웨어
// AJAX 요청의 JSON 데이터를 req.body로 파싱
app.use(express.json());

// URL 인코딩된 데이터 파싱 미들웨어
// 일반 폼 제출 데이터를 req.body로 파싱
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 설정
// public 폴더의 파일들(CSS, JS, 이미지 등)을 웹에서 직접 접근 가능하게 함
// 예: public/style.css → http://localhost:3001/style.css
app.use(express.static(path.join(__dirname, 'public')));

// cookie-parser 미들웨어 등록
app.use(cookieParser()); 

// 정적 파일 서빙 설정
// public 폴더의 파일들(CSS, JS, 이미지 등)을 웹에서 직접 접근 가능하게 함
// 예: public/style.css → http://localhost:3001/style.css
app.use(express.static(path.join(__dirname, 'public')));

// 라우터 미들웨어 등록
// 모든 요청('/')을 routes 모듈로 전달하여 처리
app.use('/', routes);
// ========================================
// 4. 서버 시작 (Server Start)
// ========================================

// 지정된 포트에서 서버 시작
app.listen(port, () => {
    // 서버가 성공적으로 시작되면 실행되는 콜백 함수
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
}).on('error', (err) => {
    // 서버 시작 중 오류가 발생하면 실행되는 이벤트 핸들러
    console.error('서버 시작 오류:', err);
});