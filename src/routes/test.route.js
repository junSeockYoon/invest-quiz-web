const express = require('express');
const testController = require('../controllers/test.controller');

const router = express.Router();

/****************************************************************************************
 *!                                     V I E W
 *  화면 렌더링용 라우트: 브라우저에 EJS 템플릿을 렌더링하여 반환합니다.
 ****************************************************************************************/
router.get('/', testController.main);
router.get('/chapters', testController.showChapters);
router.get('/chapter/:chapterId', testController.getQuestionsByChapter);

/****************************************************************************************
 *!                                     A P I
 *  API 라우트: JSON 데이터를 주고받는 API 엔드포인트입니다.
 ****************************************************************************************/
router.get('/api/chapters', testController.getChapters);
router.post('/submit', testController.submitResult);

module.exports = router;