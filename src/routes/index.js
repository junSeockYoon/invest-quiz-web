//index.js (라우트의 허브역활)

// Express 모듈 로드
// 라우팅 기능을 사용하기 위해 Express를 불러옵니다.
const express = require('express');

// 메인 도메인(게시글 목록/상세 등)과 관련된 하위 라우터를 불러옵니다.
// 실제 개별 경로 정의는 ./main.route.js 에서 처리됩니다.
const mainRoute = require('./main.route');
const testRoute = require('./test.route');
const adminRoute = require('./admin.route');

// 하위 라우터들을 묶어 외부로 내보낼 상위 라우터 객체를 생성합니다.
const router = express.Router();

// 메인 라우트 바인딩
// '/'로 들어오는 모든 요청을 mainRoute에게 위임합니다.
// 예) GET '/' → mainRoute.index, GET '/detail/:id' → mainRoute.detail 등
router.use('/', mainRoute);
router.use('/test', testRoute);
router.use('/admin', adminRoute);
// 이 라우터를 모듈로 내보내서 app.js에서 사용합니다.
module.exports = router;